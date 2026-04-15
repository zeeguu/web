import { useState, useContext, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { APIContext } from "../../contexts/APIContext";
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
  const [hasFetched, setHasFetched] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (hasFetched || !exerciseBookmark?.user_word_id) return;

    api.fetchAndSortContexts(exerciseBookmark)
      .then((allContexts) => {
        setContexts(allContexts);
        setHasFetched(true);
      })
      .catch((error) => console.error("Failed to fetch contexts:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark?.user_word_id]);

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
    api.setPreferredBookmark(exerciseBookmark.user_word_id, context.bookmark.id);
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
