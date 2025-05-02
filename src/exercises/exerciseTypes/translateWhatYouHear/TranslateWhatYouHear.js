import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";

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
}) {
  const api = useContext(APIContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState();
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);

  async function handleSpeak() {
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!SessionStorage.isAudioExercisesEnabled()) moveToNextExercise();
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_identifier,
        null,
        exerciseBookmark.fragment_id,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  useEffect(() => {
    if (SessionStorage.isAudioExercisesEnabled()) {
      setTimeout(() => {
        handleSpeak();
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  if (!interactiveText || !exerciseBookmark) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">{strings.translateWhatYouHearHeadline}</div>
      {bookmarkProgressBar}
      {!isExerciseOver && (
        <>
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={exerciseBookmark}
              styling="large"
              parentIsSpeakingControl={isButtonSpeaking}
            />
          </s.CenteredRowTall>
          <div className="contextExample">
            <TranslatableText
              isExerciseOver={isExerciseOver}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={exerciseBookmark.from}
              exerciseType={EXERCISE_TYPE}
              leftEllipsis={exerciseBookmark.left_ellipsis}
              rightEllipsis={exerciseBookmark.right_ellipsis}
            />
          </div>
          <BottomInput
            handleCorrectAnswer={notifyCorrectAnswer}
            handleIncorrectAnswer={notifyIncorrectAnswer}
            handleExerciseCompleted={notifyExerciseCompleted}
            setIsCorrect={setIsCorrect}
            exerciseBookmark={exerciseBookmark}
            notifyOfUserAttempt={notifyOfUserAttempt}
            isL1Answer={true}
          />
        </>
      )}

      {isExerciseOver && (
        <>
          <h1 className="wordInContextHeadline">{exerciseBookmark.to}</h1>
          <div className="contextExample">
            <TranslatableText
              isExerciseOver={isExerciseOver}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={exerciseBookmark.from}
              leftEllipsis={exerciseBookmark.left_ellipsis}
              rightEllipsis={exerciseBookmark.right_ellipsis}
            />
          </div>
        </>
      )}
    </s.Exercise>
  );
}
