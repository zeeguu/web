import { useState, useContext, useEffect, useCallback } from "react";
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

  const handlePrevious = useCallback(() => {
    if (isSaving || currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    selectContext(contexts[newIndex]);
  }, [isSaving, currentIndex, contexts]);

  const handleNext = useCallback(() => {
    if (isSaving || currentIndex >= contexts.length - 1) return;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    selectContext(contexts[newIndex]);
  }, [isSaving, currentIndex, contexts]);

  if (!onExampleUpdated) return null;

  const hasMultipleContexts = contexts.length > 1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < contexts.length - 1;
  const currentContext = contexts[currentIndex];

  // Keyboard arrow navigation for desktop
  useEffect(() => {
    if (!hasMultipleContexts) return;

    const handleKeyDown = (e) => {
      // Don't interfere with input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' && canGoPrevious) {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight' && canGoNext) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultipleContexts, canGoPrevious, canGoNext, handlePrevious, handleNext]);

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
      {hasMultipleContexts && (
        <s.NavigationContainer>
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
        </s.NavigationContainer>
      )}
    </div>
  );
}
