import { useState, useContext, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { APIContext } from "../../contexts/APIContext";
import { toast } from "react-toastify";
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
  const [slideDirection, setSlideDirection] = useState(null); // 'left' or 'right'
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // Transition from exiting to entering when isSaving becomes false.
  // isSaving is set to false in the finally block of selectContext after the API call.
  useEffect(() => {
    if (!isSaving && isExiting) {
      setIsExiting(false);
      setIsEntering(true);
    }
  }, [isSaving, isExiting]);

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

  // Go to next example (swipe left / button click)
  const handleNext = useCallback(() => {
    if (isSaving || contexts.length <= 1) return;
    setSlideDirection('left');
    setIsExiting(true);
    const newIndex = (currentIndex + 1) % contexts.length;
    setCurrentIndex(newIndex);
    selectContext(contexts[newIndex]);
  }, [isSaving, currentIndex, contexts]);

  // Go to previous example (swipe right)
  const handlePrevious = useCallback(() => {
    if (isSaving || contexts.length <= 1) return;
    setSlideDirection('right');
    setIsExiting(true);
    const newIndex = (currentIndex - 1 + contexts.length) % contexts.length;
    setCurrentIndex(newIndex);
    selectContext(contexts[newIndex]);
  }, [isSaving, currentIndex, contexts]);

  if (!onExampleUpdated) return null;

  const hasMultipleContexts = contexts.length > 1;

  // Keyboard arrow navigation for desktop
  useEffect(() => {
    if (!hasMultipleContexts) return;

    const handleKeyDown = (e) => {
      // Don't interfere with input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultipleContexts, handleNext, handlePrevious]);

  // Swipe handlers for mobile navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => hasMultipleContexts && handleNext(),
    onSwipedRight: () => hasMultipleContexts && handlePrevious(),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50, // minimum swipe distance
  });

  return (
    <s.SlideContainer>
      {/* Left arrow */}
      {hasMultipleContexts && (
        <s.NavArrow $side="left" onClick={handlePrevious} disabled={isSaving}>
          ‹
        </s.NavArrow>
      )}

      {/* Swipeable content area */}
      {children && (
        <s.SlideContent
          {...swipeHandlers}
          $exiting={isExiting}
          $entering={isEntering}
          $direction={slideDirection}
          onAnimationEnd={() => setIsEntering(false)}
        >
          {children}
        </s.SlideContent>
      )}

      {/* Right arrow */}
      {hasMultipleContexts && (
        <s.NavArrow $side="right" onClick={handleNext} disabled={isSaving}>
          ›
        </s.NavArrow>
      )}
    </s.SlideContainer>
  );
}
