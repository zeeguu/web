import { useState, useContext, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { APIContext } from "../../contexts/APIContext";
import * as Sentry from "@sentry/react";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null); // 'left' or 'right'
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // Fetch contexts eagerly on mount
  useEffect(() => {
    fetchContexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark?.user_word_id]);

  const fetchContexts = async () => {
    if (hasFetched || !exerciseBookmark?.user_word_id) return;
    setIsLoading(true);

    try {
      const [pastResponse, alternativesResponse] = await Promise.all([
        fetch(
          `${api.baseAPIurl}/past_contexts/${exerciseBookmark.user_word_id}?session=${api.session}`,
          { method: "GET" },
        ).catch(() => null),
        fetch(
          `${api.baseAPIurl}/alternative_sentences/${exerciseBookmark.user_word_id}?session=${api.session}`,
          { method: "GET" },
        ).catch(() => null),
      ]);

      let pastContexts = [];
      let alternatives = [];

      const normalizeSentence = (s) =>
        s?.trim().toLowerCase().replace(/\s+/g, " ") || "";
      const currentSentenceNormalized = normalizeSentence(
        exerciseBookmark?.context,
      );

      if (pastResponse?.ok) {
        const contentType = pastResponse.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const pastData = await pastResponse.json();
          pastContexts = (pastData.past_contexts || [])
            .filter(
              (ctx) =>
                !ctx.is_preferred &&
                normalizeSentence(ctx.context) !== currentSentenceNormalized,
            )
            .map((ctx) => ({
              id: ctx.bookmark_id,
              sentence: ctx.context,
              translation: ctx.translation || "",
              contextType: ctx.context_type,
              title: ctx.title,
              source_id: ctx.source_id,
              isFromHistory: true,
              bookmark: ctx.bookmark || null,
            }));
        }
      }

      if (alternativesResponse?.ok) {
        const altData = await alternativesResponse.json();
        alternatives = (altData.examples || [])
          .filter(
            (example) =>
              normalizeSentence(example.sentence) !== currentSentenceNormalized,
          )
          .map((example) => ({
            ...example,
            isFromHistory: false,
          }));
      }

      // Current context is always first — include the full bookmark so swiping
      // back restores the original content via the same optimistic path.
      const currentContext = {
        id: exerciseBookmark.id,
        sentence: exerciseBookmark.context,
        title: exerciseBookmark.title,
        source_id: exerciseBookmark.source_id,
        isCurrent: true,
        bookmark: exerciseBookmark,
      };

      setContexts([
        currentContext,
        ...pastContexts.sort((a, b) => a.sentence.length - b.sentence.length),
        ...alternatives.sort((a, b) => a.sentence.length - b.sentence.length),
      ]);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch contexts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectContext = (context) => {
    // If we have a pre-formed bookmark, update UI instantly
    if (context.bookmark) {
      onExampleUpdated({
        selectedExample: context,
        updatedBookmark: context.bookmark,
      });

      // Persist preference server-side (skip for original card — it's already preferred)
      if (!context.isCurrent) {
        const url = `${api.baseAPIurl}/set_preferred_bookmark/${exerciseBookmark.user_word_id}?session=${api.session}`;
        const payload = { bookmark_id: context.bookmark.id };
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((error) => {
          Sentry.captureException(error, {
            extra: { userWordId: exerciseBookmark?.user_word_id },
          });
        });
      }
      return;
    }

    // Fallback for contexts without pre-formed bookmark: fire POST
    let url, payload;
    if (context.isFromHistory) {
      url = `${api.baseAPIurl}/set_preferred_bookmark/${exerciseBookmark.user_word_id}?session=${api.session}`;
      payload = { bookmark_id: context.id };
    } else {
      url = `${api.baseAPIurl}/set_preferred_example/${exerciseBookmark.user_word_id}?session=${api.session}`;
      payload = { sentence_id: context.id };
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          response
            .json()
            .catch(() => ({}))
            .then((errorData) => {
              Sentry.captureMessage(
                errorData.error || "Failed to update example",
                {
                  level: "warning",
                  extra: {
                    errorData,
                    userWordId: exerciseBookmark?.user_word_id,
                  },
                },
              );
            });
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data?.updated_bookmark) {
          onExampleUpdated({
            selectedExample: context,
            updatedBookmark: data.updated_bookmark,
          });
        }
      })
      .catch((error) => {
        Sentry.captureException(error, {
          extra: { userWordId: exerciseBookmark?.user_word_id },
        });
      });
  };

  // Go to next example (swipe left / button click)
  const handleNext = useCallback(() => {
    if (isAnimating || contexts.length <= 1) return;
    setIsAnimating(true);
    setSlideDirection("left");
    setIsExiting(true);
    const newIndex = (currentIndex + 1) % contexts.length;
    setCurrentIndex(newIndex);

    // After exit animation (200ms), swap content and start enter animation
    setTimeout(() => {
      selectContext(contexts[newIndex]);
      setIsExiting(false);
      setIsEntering(true);
    }, 200);
  }, [isAnimating, currentIndex, contexts]);

  // Go to previous example (swipe right)
  const handlePrevious = useCallback(() => {
    if (isAnimating || contexts.length <= 1) return;
    setIsAnimating(true);
    setSlideDirection("right");
    setIsExiting(true);
    const newIndex = (currentIndex - 1 + contexts.length) % contexts.length;
    setCurrentIndex(newIndex);

    // After exit animation (200ms), swap content and start enter animation
    setTimeout(() => {
      selectContext(contexts[newIndex]);
      setIsExiting(false);
      setIsEntering(true);
    }, 200);
  }, [isAnimating, currentIndex, contexts]);

  if (!onExampleUpdated) return null;

  const hasMultipleContexts = contexts.length > 1;

  // Keyboard arrow navigation for desktop
  useEffect(() => {
    if (!hasMultipleContexts) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleContexts, handleNext, handlePrevious]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => hasMultipleContexts && handleNext(),
    onSwipedRight: () => hasMultipleContexts && handlePrevious(),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  return (
    <s.SlideContainer>
      <s.NavArrow
        onClick={handlePrevious}
        disabled={isAnimating}
        $hidden={!hasMultipleContexts}
      >
        ‹
      </s.NavArrow>

      {children && (
        <s.SlideContent
          {...swipeHandlers}
          $exiting={isExiting}
          $entering={isEntering}
          $direction={slideDirection}
          onAnimationEnd={() => {
            setIsEntering(false);
            setIsAnimating(false);
          }}
        >
          {children}
        </s.SlideContent>
      )}

      <s.NavArrow
        onClick={handleNext}
        disabled={isAnimating}
        $hidden={!hasMultipleContexts}
      >
        ›
      </s.NavArrow>
    </s.SlideContainer>
  );
}
