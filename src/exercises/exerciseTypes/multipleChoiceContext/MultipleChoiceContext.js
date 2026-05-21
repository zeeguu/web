import { useState, useEffect, useContext, useMemo, useRef } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { ClozeTranslatableText } from "../../components/ClozeTranslatableText.js";
import { findClozeWordIds } from "../../utils/findClozeWordIds.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";
import { useFlipOnReveal } from "../../utils/useFlipOnReveal.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import useShadowRef from "../../../hooks/useShadowRef";
import { APIContext } from "../../../contexts/APIContext.js";
import { highlightWord, replaceWordWithPlaceholder } from "../../../utils/text/highlightWord";

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
  const [clickedIndex, setClickedIndex] = useState(null);
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
    // Update exerciseBookmark when bookmarksToStudy changes
    const newExerciseBookmark = { ...bookmarksToStudy[0], isExercise: true };
    setExerciseBookmark(newExerciseBookmark);
    
    // Validate that context_tokenized exists and is properly formatted
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

  function notifyChoiceSelection(selectedChoiceId, index, e) {
    if (isExerciseOver) return;
    setClickedOption(index);
    if (selectedChoiceId === exerciseBookmark.id) {
      setClickedIndex(index);
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setClickedIndex(null);
      notifyIncorrectAnswer(exerciseBookmark);
      setTimeout(() => {
        // This line is here to avoid the reseting the styling on the
        // correct box if the user clicks on it shortly after getting the
        // context wrong.
        if (!isExerciseOverRef.current) setClickedOption(null);
      }, 500);
    }
  }

  // Get the text to display for an option
  // When exercise is over: highlight the word
  // During exercise: replace target with blank placeholder.
  // Post-reveal the chosen context is rendered via ClozeTranslatableText
  // for the bookmark-restoration chip-above treatment (see below).
  function getOptionDisplayText(option) {
    if (isExerciseOver) {
      return highlightWord(option.context, option.from);
    } else {
      return replaceWordWithPlaceholder(option.context, option.from, "_____");
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
      {/* Instruction + L2 prompt are content during exercise; post-reveal
          we keep them in the layout (visibility:hidden) so the chosen
          option lands at a stable y-coordinate. Without this, removing
          the headline lets the chosen option fly all the way to the top
          of the card — distance varies with which option was clicked,
          which makes the slide feel disorienting. */}
      <div style={{ visibility: isExerciseOver ? "hidden" : "visible" }} aria-hidden={isExerciseOver}>
        <div className="headlineWithMoreSpace">
          {strings.multipleChoiceContextHeadline}
        </div>
        <h1 className="wordInContextHeadline">
          {removePunctuation(exerciseBookmark.from)}
        </h1>
      </div>
      {/* Progress bar moved below the option list — putting it above
          would squeeze the option cards down at the moment of reveal.
          Consistent with the other exercises in the flow. */}
      {exerciseBookmarks
        .filter((option) => !isExerciseOver || option.isExercise)
        .map((option, index) => (
          <s.MultipleChoiceContext
            key={index}
            ref={option.isExercise ? correctOptionRef : null}
            clicked={index === clickedIndex}
            className={[
              clickedOption !== null && index === clickedOption ? (option.isExercise ? "correct" : "wrong") : "",
              isExerciseOver && option.isExercise ? "revealed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={(e) => notifyChoiceSelection(option.id, index, e)}
          >
            {isExerciseOver && option.isExercise && interactiveText ? (
              // Render the chosen context via the same InteractiveText
              // path the other exercises use — bookmark restoration
              // gives us the chip-above-word + bright-orange + dotted
              // underline + tap-to-pronounce treatment for free.
              <ClozeTranslatableText
                interactiveText={interactiveText}
                isExerciseOver={isExerciseOver}
                translating={true}
                pronouncing={true}
                clozeWordIds={clozeWordIds}
                leftEllipsis={option.left_ellipsis}
                rightEllipsis={option.right_ellipsis}
              />
            ) : (
              <>
                {option.left_ellipsis && <>...</>}
                <span
                  dangerouslySetInnerHTML={{
                    __html: getOptionDisplayText(option),
                  }}
                />
                {option.right_ellipsis && <>...</>}
              </>
            )}
          </s.MultipleChoiceContext>
        ))}
      {isExerciseOver && bookmarkProgressBar && (
        <div style={{ marginTop: "1em" }}>
          {bookmarkProgressBar}
        </div>
      )}
    </s.Exercise>
  );
}
