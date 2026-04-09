import { useState, useContext, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { APIContext } from "../../contexts/APIContext";
import * as Sentry from "@sentry/react";
import * as s from "./ContextNavigationControls.sc";
import useKeyboardNavigation from "../../hooks/useKeyboardNavigation";

// Must match the exit transition duration in ContextNavigationControls.sc.js
const EXIT_ANIMATION_MS = 200;

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
  const [slideDirection, setSlideDirection] = useState(null);
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
      const currentNormalized = normalizeSentence(exerciseBookmark?.context);

      if (pastResponse?.ok) {
        const contentType = pastResponse.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const pastData = await pastResponse.json();
          pastContexts = (pastData.past_contexts || [])
            .filter(
              (ctx) =>
                !ctx.is_preferred &&
                normalizeSentence(ctx.context) !== currentNormalized,
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
              normalizeSentence(example.sentence) !== currentNormalized,
          )
          .map((example) => ({
            ...example,
            isFromHistory: false,
          }));
      }

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

  // ── Switching context ───────────────────────────────────────────────

  /** Update the exercise UI to show a different context's content. */
  function applyContext(context) {
    if (!context.bookmark) return;
    onExampleUpdated({
      selectedExample: context,
      updatedBookmark: context.bookmark,
    });
  }

  /** Tell the server which bookmark the user prefers (fire-and-forget). */
  function persistPreference(context) {
    if (context.isCurrent || !context.bookmark) return;

    const url = `${api.baseAPIurl}/set_preferred_bookmark/${exerciseBookmark.user_word_id}?session=${api.session}`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookmark_id: context.bookmark.id }),
    }).catch((error) => {
      Sentry.captureException(error, {
        extra: { userWordId: exerciseBookmark?.user_word_id },
      });
    });
  }

  // ── Navigation ──────────────────────────────────────────────────────

  /** Navigate to a neighbouring card. direction: 'left' (next) or 'right' (previous). */
  const navigate = useCallback(
    (direction) => {
      if (isAnimating || contexts.length <= 1) return;

      const delta = direction === "left" ? 1 : -1;
      const newIndex =
        (currentIndex + delta + contexts.length) % contexts.length;
      const target = contexts[newIndex];

      setIsAnimating(true);
      setSlideDirection(direction);
      setIsExiting(true);
      setCurrentIndex(newIndex);

      // After the exit animation, swap content and slide the new card in.
      setTimeout(() => {
        applyContext(target);
        persistPreference(target);
        setIsExiting(false);
        setIsEntering(true);
      }, EXIT_ANIMATION_MS);
    },
    [isAnimating, currentIndex, contexts],
  );

  if (!onExampleUpdated) return null;

  const hasMultipleContexts = contexts.length > 1;

  useKeyboardNavigation({
    ArrowRight: () => navigate("left"),
    ArrowLeft: () => navigate("right"),
  }, hasMultipleContexts);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => hasMultipleContexts && navigate("left"),
    onSwipedRight: () => hasMultipleContexts && navigate("right"),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  return (
    <s.SlideContainer>
      <s.NavArrow
        onClick={() => navigate("right")}
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
        onClick={() => navigate("left")}
        disabled={isAnimating}
        $hidden={!hasMultipleContexts}
      >
        ›
      </s.NavArrow>
    </s.SlideContainer>
  );
}
