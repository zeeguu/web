import { useState, useEffect, useContext, useMemo, useRef } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { ClozeTranslatableText } from "../../components/ClozeTranslatableText.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { findClozeWordIds } from "../../utils/findClozeWordIds.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";
import { useFlipOnReveal } from "../../utils/useFlipOnReveal.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import useShadowRef from "../../../hooks/useShadowRef";
import { APIContext } from "../../../contexts/APIContext.js";
import { replaceWordWithPlaceholder } from "../../../utils/text/highlightWord";

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceContext;

export default function MultipleChoiceContext({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  reload,
  resetSubSessionTimer,
  bookmarkProgressBar,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const [exerciseBookmarks, setExerciseBookmarks] = useState(null);
  const [interactiveText, setInteractiveText] = useState(null);
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);
  const speech = useContext(SpeechContext);
  const [exerciseBookmark, setExerciseBookmark] = useState({ ...bookmarksToStudy[0], isExercise: true });
  const [clickedOption, setClickedOption] = useState(null);
  const isExerciseOverRef = useShadowRef(isExerciseOver);
  // FLIP: slide the correct option from its randomized position up to
  // the solution slot when reveal kicks in. Ref points to the same
  // styled.div both pre- and post-reveal (only the children change).
  const correctOptionRef = useRef(null);
  useFlipOnReveal(correctOptionRef, isExerciseOver);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    const initExerciseBookmarks = bookmarksToStudy.map((b, i) => ({ ...b, isExercise: i === 0 }));
    setExerciseBookmarks(shuffle(initExerciseBookmarks));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const newExerciseBookmark = { ...bookmarksToStudy[0], isExercise: true };
    setExerciseBookmark(newExerciseBookmark);

    if (!newExerciseBookmark.context_tokenized || !Array.isArray(newExerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    const adaptedBookmark = adaptExerciseBookmark(newExerciseBookmark);
    setInteractiveText(
      new InteractiveText(
        newExerciseBookmark.context_tokenized,
        newExerciseBookmark.source_id,
        api,
        adaptedBookmark ? [adaptedBookmark] : [],
        "TRANSLATE WORDS IN EXERCISE",
        newExerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        newExerciseBookmark.context_identifier,
      ),
    );
    // eslint-disable-next-line
  }, [reload, bookmarksToStudy]);

  function notifyChoiceSelection(selectedChoiceId, index) {
    if (isExerciseOver) return;
    setClickedOption(index);
    if (selectedChoiceId === exerciseBookmark.id) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      notifyIncorrectAnswer(exerciseBookmark);
      setTimeout(() => {
        // Don't reset the styling on the correct box if the user clicks
        // on it shortly after getting the context wrong.
        if (!isExerciseOverRef.current) setClickedOption(null);
      }, 500);
    }
  }

  // Word IDs for the bookmark within the chosen-option InteractiveText
  // — flips isTranslationVisible on the cloze word post-reveal so the
  // L1 chip surfaces above it.
  const clozeWordIds = useMemo(() => {
    if (!interactiveText || !exerciseBookmark) return [];
    return findClozeWordIds(interactiveText, exerciseBookmark);
  }, [interactiveText, exerciseBookmark]);

  if (!interactiveText || !exerciseBookmarks) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="findWordInContext">
      {/* Header stays in the layout post-reveal (visibility:hidden) so
          the chosen option lands at a stable y — removing it would let
          the chosen option fly all the way to the top of the card,
          with distance varying by which option was clicked. */}
      <ExerciseInstructionHeader
        headline={strings.multipleChoiceContextHeadline}
        l2Prompt={removePunctuation(exerciseBookmark.from)}
        isExerciseOver={isExerciseOver}
      />
      {/* Progress bar moved below the option list — putting it above
          would squeeze the option cards down at the moment of reveal.
          Consistent with the other exercises in the flow. */}
      {exerciseBookmarks
        .filter((option) => !isExerciseOver || option.isExercise)
        .map((option, index) => {
          const isClicked = clickedOption !== null && index === clickedOption;
          const clickedClass = isClicked ? (option.isExercise ? "correct" : "wrong") : "";
          const revealedClass = isExerciseOver && option.isExercise ? "revealed" : "";
          const className = [clickedClass, revealedClass].filter(Boolean).join(" ");

          // Render the chosen context via the same InteractiveText path
          // the other exercises use — bookmark restoration gives us the
          // chip-above-word + bright-orange + dotted underline + tap-to-
          // pronounce treatment for free.
          const revealedContent = (
            <ClozeTranslatableText
              interactiveText={interactiveText}
              isExerciseOver={isExerciseOver}
              translating={true}
              pronouncing={true}
              clozeWordIds={clozeWordIds}
              leftEllipsis={option.left_ellipsis}
              rightEllipsis={option.right_ellipsis}
            />
          );
          const clozeContent = (
            <>
              {option.left_ellipsis && <>...</>}
              <span
                dangerouslySetInnerHTML={{
                  __html: replaceWordWithPlaceholder(option.context, option.from, "_____"),
                }}
              />
              {option.right_ellipsis && <>...</>}
            </>
          );
          const showRevealed = isExerciseOver && option.isExercise;

          return (
            <s.MultipleChoiceContext
              key={index}
              ref={option.isExercise ? correctOptionRef : null}
              className={className}
              onClick={() => notifyChoiceSelection(option.id, index)}
            >
              {showRevealed ? revealedContent : clozeContent}
            </s.MultipleChoiceContext>
          );
        })}
      {isExerciseOver && bookmarkProgressBar && (
        <div style={{ marginTop: "1em" }}>
          {bookmarkProgressBar}
        </div>
      )}
    </s.Exercise>
  );
}
