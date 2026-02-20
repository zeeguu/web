import { useState, useContext, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { APIContext } from "../../contexts/APIContext";
import { toast } from "react-toastify";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import * as s from "./ContextNavigationControls.sc";

export default function ContextNavigationControls({
  exerciseBookmark,
  onExampleUpdated,
  isExerciseOver,
  children,
}) {
  const api = useContext(APIContext);
  const [contexts, setContexts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch contexts eagerly on mount
  useEffect(() => {
    fetchContexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark?.user_word_id]);

  const fetchContexts = async () => {
    if (hasFetched || !exerciseBookmark?.user_word_id) return;

    setIsLoading(true);

    try {
      // Fetch both past contexts and alternatives in parallel
      const [pastResponse, alternativesResponse] = await Promise.all([
        fetch(
          `${api.baseAPIurl}/past_contexts/${exerciseBookmark.user_word_id}?session=${api.session}`,
          { method: "GET" }
        ).catch(() => null),
        fetch(
          `${api.baseAPIurl}/alternative_sentences/${exerciseBookmark.user_word_id}?session=${api.session}`,
          { method: "GET" }
        ).catch(() => null),
      ]);

      let pastContexts = [];
      let alternatives = [];

      // Helper to normalize sentence for comparison
      const normalizeSentence = (s) => s?.trim().toLowerCase().replace(/\s+/g, ' ') || '';
      const currentSentenceNormalized = normalizeSentence(exerciseBookmark?.context);

      // Process past contexts - filter out duplicates of current context
      if (pastResponse?.ok) {
        const contentType = pastResponse.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const pastData = await pastResponse.json();
          pastContexts = (pastData.past_contexts || [])
            .filter((ctx) => !ctx.is_preferred && normalizeSentence(ctx.context) !== currentSentenceNormalized)
            .map((ctx) => ({
              id: ctx.bookmark_id,
              sentence: ctx.context,
              translation: ctx.translation || "",
              contextType: ctx.context_type,
              title: ctx.title,
              source_id: ctx.source_id,
              isFromHistory: true,
            }));
        }
      }

      // Process alternatives - filter out duplicates of current context
      if (alternativesResponse?.ok) {
        const altData = await alternativesResponse.json();
        alternatives = (altData.examples || [])
          .filter((example) => normalizeSentence(example.sentence) !== currentSentenceNormalized)
          .map((example) => ({
            ...example,
            isFromHistory: false,
          }));
      }

      // Current context is always first - store title so we don't lose it when switching
      const currentContext = {
        id: exerciseBookmark.id,
        sentence: exerciseBookmark.context,
        title: exerciseBookmark.title,
        source_id: exerciseBookmark.source_id,
        isCurrent: true,
      };

      // Combine: current + past contexts (sorted by length) + alternatives (sorted by length)
      const allContexts = [
        currentContext,
        ...pastContexts.sort((a, b) => a.sentence.length - b.sentence.length),
        ...alternatives.sort((a, b) => a.sentence.length - b.sentence.length),
      ];

      setContexts(allContexts);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch contexts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectContext = async (context) => {
    if (context.isCurrent || isSaving) return;

    setIsSaving(true);

    let url, payload;

    if (context.isFromHistory) {
      url = `${api.baseAPIurl}/set_preferred_bookmark/${exerciseBookmark.user_word_id}?session=${api.session}`;
      payload = { bookmark_id: context.id };
    } else {
      url = `${api.baseAPIurl}/set_preferred_example/${exerciseBookmark.user_word_id}?session=${api.session}`;
      payload = { sentence_id: context.id };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || `Failed to update example`);
        return;
      }

      const data = await response.json();

      onExampleUpdated({
        selectedExample: context,
        updatedBookmark: data.updated_bookmark,
      });
    } catch (error) {
      console.error("Failed to save context:", error);
      toast.error("Failed to update example");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = () => {
    if (isSaving || currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    selectContext(contexts[newIndex]);
  };

  const handleNext = () => {
    if (isSaving || currentIndex >= contexts.length - 1) return;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    selectContext(contexts[newIndex]);
  };

  if (!onExampleUpdated) return null;

  const hasMultipleContexts = contexts.length > 1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < contexts.length - 1;
  const currentContext = contexts[currentIndex];

  // Determine source text for current context - only show if there's an article title
  const getSourceDisplay = () => {
    // Before contexts are loaded, check exerciseBookmark
    if (!currentContext) {
      if (exerciseBookmark?.title) {
        return (
          <span>
            From: <a href={`/read/article?id=${exerciseBookmark.source_id}`} target="_blank" rel="noopener noreferrer">{exerciseBookmark.title}</a>
          </span>
        );
      }
      return null;
    }

    // For any context with a title, show the source
    if (currentContext.title) {
      return (
        <span>
          From: <a href={`/read/article?id=${currentContext.source_id}`} target="_blank" rel="noopener noreferrer">{currentContext.title}</a>
        </span>
      );
    }

    // No title = generated or unknown source, show nothing
    return null;
  };

  const sourceDisplay = getSourceDisplay();

  // Swipe handlers for mobile navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => hasMultipleContexts && canGoNext && handleNext(),
    onSwipedRight: () => hasMultipleContexts && canGoPrevious && handlePrevious(),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50, // minimum swipe distance
  });

  return (
    <div>
      {/* Swipeable content area */}
      {children && (
        <div {...swipeHandlers} style={{ touchAction: "pan-y" }}>
          {children}
        </div>
      )}

      {/* Navigation controls */}
      <s.NavigationContainer>
        <s.SourceInfo>
          {sourceDisplay}
        </s.SourceInfo>

        {hasMultipleContexts && (
          <s.ArrowsContainer>
            <s.ArrowButton
              onClick={handlePrevious}
              disabled={!canGoPrevious || isSaving}
              title="Previous example"
            >
              <ArrowBackRoundedIcon fontSize="inherit" />
            </s.ArrowButton>

            <s.ContextIndicator>
              {currentIndex + 1}/{contexts.length}
            </s.ContextIndicator>

            <s.ArrowButton
              onClick={handleNext}
              disabled={!canGoNext || isSaving}
              title="Next example"
            >
              <ArrowForwardRoundedIcon fontSize="inherit" />
            </s.ArrowButton>
          </s.ArrowsContainer>
        )}
      </s.NavigationContainer>
    </div>
  );
}
