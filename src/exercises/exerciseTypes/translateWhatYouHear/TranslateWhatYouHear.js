import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";

// The user has to translate the word they hear into their L1.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.translateWhatYouHear;

export default function TranslateWhatYouHear({
  bookmarksToStudy,
  notifyOfUserAttempt,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  notifyExerciseCompleted,
  setIsCorrect,
  moveToNextExercise,
  setExerciseType,
  reload,
  isExerciseOver,
  resetSubSessionTimer,
  bookmarkProgressBar,
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType: EXERCISE_TYPE });

  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType: EXERCISE_TYPE,
    reload,
    onExerciseLoaded,
  });

  useEffect(() => {
    if (!SessionStorage.isAudioExercisesEnabled()) moveToNextExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, exerciseBookmark]);

  useEffect(() => {
    if (interactiveText && SessionStorage.isAudioExercisesEnabled()) {
      setTimeout(() => speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="translateWhatYouHear">
      <ExerciseInstructionHeader
        headline={strings.translateWhatYouHearHeadline}
        isExerciseOver={isExerciseOver}
      />

      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        onInputChange={() => {}}
        onInputSubmit={() => {}}
        inputValue={isExerciseOver ? exerciseBookmark.from : ""}
        placeholder=""
        isCorrectAnswer={isExerciseOver}
        shouldFocus={false}
        showHint={false}
        canTypeInline={false}
        aboveClozeElement={
          <SpeakButton
            bookmarkToStudy={exerciseBookmark}
            styling="inline"
            parentIsSpeakingControl={isButtonSpeaking}
          />
        }
      />

      {isExerciseOver && bookmarkProgressBar && (
        <s.CenteredRevealedSlot>{bookmarkProgressBar}</s.CenteredRevealedSlot>
      )}

      {!isExerciseOver && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={notifyIncorrectAnswer}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
          isL1Answer={true}
        />
      )}
    </s.Exercise>
  );
}
