import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";
import shuffle from "../../../assorted/fisherYatesShuffle.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import MultipleChoiceAudioBottomInput from "./MultipleChoiceAudioBottomInput.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to select the correct spoken L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceAudio;

export default function MultipleChoiceAudio({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  resetSubSessionTimer,
  moveToNextExercise,
  reload,
  bookmarkProgressBar,
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);
  const [choiceOptions, setChoiceOptions] = useState(null);
  const [currentSelectedChoice, setCurrentSelectedChoice] = useState("");
  const exerciseBookmark = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    const adaptedBookmark = adaptExerciseBookmark(exerciseBookmark);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        adaptedBookmark ? [adaptedBookmark] : [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_identifier,
      ),
    );

    // Index 0 is the correct bookmark; 1 and 2 are distractors.
    setChoiceOptions(shuffle([0, 1, 2]));
    if (!SessionStorage.isAudioExercisesEnabled()) moveToNextExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, exerciseBookmark]);

  if (!interactiveText || !choiceOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      <ExerciseInstructionHeader
        headline={strings.multipleChoiceAudioHeadline}
        isExerciseOver={isExerciseOver}
      />

      {/* Context - always at the top, never moves */}
      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        onInputChange={() => {}}
        onInputSubmit={() => {}}
        inputValue=""
        placeholder=""
        isCorrectAnswer={false}
        shouldFocus={false}
        showHint={false}
        canTypeInline={false}
      />

      {!isExerciseOver && (
        <div style={{ marginTop: "2em" }}>
          <s.CenteredWordRow>
            {choiceOptions.map((option) => (
              <SpeakButton
                onClickCallback={() => setCurrentSelectedChoice(option)}
                isSelected={option === currentSelectedChoice}
                bookmarkToStudy={bookmarksToStudy[option]}
                id={option}
                styling={option === currentSelectedChoice ? "selected" : ""}
              />
            ))}
          </s.CenteredWordRow>
        </div>
      )}

      {/* Solution area - L1 chip above the highlighted word replaces
          the legacy big headline. */}
      {isExerciseOver && bookmarkProgressBar && (
        <div style={{ marginTop: "3em" }}>
          {bookmarkProgressBar}
        </div>
      )}

      {/* Bottom input - only during exercise */}
      {!isExerciseOver && (
        <MultipleChoiceAudioBottomInput
          bookmarksToStudy={bookmarksToStudy}
          currentChoice={currentSelectedChoice}
          targetBookmark={exerciseBookmark}
          notifyCorrectAnswer={notifyCorrectAnswer}
          notifyIncorrectAnswer={notifyIncorrectAnswer}
        />
      )}
    </s.Exercise>
  );
}
