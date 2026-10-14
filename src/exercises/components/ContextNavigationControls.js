import { useState, useContext, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { APIContext } from "../../contexts/APIContext";
import * as s from "./ContextNavigationControls.sc";
import useKeyboardNavigation from "../../hooks/useKeyboardNavigation";
import LocalStorage from "../../assorted/LocalStorage";

// Must match the exit transition duration in ContextNavigationControls.sc.js
const EXIT_ANIMATION_MS = 200;

// The swipe hint plays on the first few exercises that have more than one
// example, then never again.
const SWIPE_HINT_TIMES = 3;

// Above this, dots stop being countable at a glance; show "3 / 9" instead.
const MAX_DOTS = 7;

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
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  useEffect(() => {
    if (hasFetched || !exerciseBookmark?.user_word_id) return;

    api.fetchAndSortContexts(exerciseBookmark)
      .then((allContexts) => {
        setContexts(allContexts);
        setHasFetched(true);
        // Swiping is touch-only (trackMouse: false), so on desktop the hint
        // would show a gesture that doesn't work there.
        const isTouch = window.matchMedia("(hover: none)").matches;
        if (isTouch && allContexts.length > 1 && LocalStorage.getContextSwipeHintCount() < SWIPE_HINT_TIMES) {
          LocalStorage.incrementContextSwipeHintCount();
          setShowSwipeHint(true);
        }
      })
      .catch((error) => console.error("Failed to fetch contexts:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark?.user_word_id]);

  function applyContext(context) {
    if (!context.bookmark) return;
    onExampleUpdated({
      selectedExample: context,
      updatedBookmark: context.bookmark,
    });
  }

  // Fire-and-forget — server-side preference; we don't wait or surface errors.
  function persistPreference(context) {
    if (context.isCurrent || !context.bookmark) return;
    api.setPreferredBookmark(exerciseBookmark.user_word_id, context.bookmark.id);
  }

  // direction: 'left' (the new card comes in from the right) or 'right'.
  const goTo = useCallback(
    (newIndex, direction) => {
      if (isAnimating || contexts.length <= 1 || newIndex === currentIndex) return;

      const target = contexts[newIndex];

      setShowSwipeHint(false);
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

  const navigate = useCallback(
    (direction) => {
      const delta = direction === "left" ? 1 : -1;
      goTo((currentIndex + delta + contexts.length) % contexts.length, direction);
    },
    [goTo, currentIndex, contexts],
  );

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

  if (!onExampleUpdated) return null;

  const dots = contexts.map((_, index) => (
    <s.Dot
      key={index}
      $current={index === currentIndex}
      onClick={() => goTo(index, index > currentIndex ? "left" : "right")}
      aria-label={`Example ${index + 1} of ${contexts.length}`}
      aria-current={index === currentIndex}
    />
  ));

  const position =
    contexts.length > MAX_DOTS ? (
      <s.Counter>
        {currentIndex + 1} / {contexts.length}
      </s.Counter>
    ) : (
      dots
    );

  return (
    <s.SlideContainer>
      {children && (
        <s.SwipeArea
          {...swipeHandlers}
          $peek={showSwipeHint}
          onAnimationEnd={(e) => {
            if (e.target.parentElement === e.currentTarget) setShowSwipeHint(false);
          }}
        >
          <s.SlideContent
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
        </s.SwipeArea>
      )}

      {hasMultipleContexts && (
        <s.Dots>
          <s.NavArrow
            onClick={() => navigate("right")}
            disabled={isAnimating}
            aria-label="Previous example"
          >
            ‹
          </s.NavArrow>
          {position}
          <s.NavArrow
            onClick={() => navigate("left")}
            disabled={isAnimating}
            aria-label="Next example"
          >
            ›
          </s.NavArrow>
        </s.Dots>
      )}
    </s.SlideContainer>
  );
}
