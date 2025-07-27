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
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to write the word they hear. A context with the word omitted is shown.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.spellWhatYouHear;

export default function SpellWhatYouHear({
  bookmarksToStudy,
  notifyOfUserAttempt,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  notifyExerciseCompleted,
  setIsCorrect,
  setExerciseType,
  moveToNextExercise,
  reload,
  isExerciseOver,
  resetSubSessionTimer,
  bookmarkProgressBar,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState();
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const exerciseBookmark = bookmarksToStudy[0];

  async function handleSpeak() {
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
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
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  useEffect(() => {
    // Timeout is set so that the page renders before the word is spoken, allowing for the user to gain focus on the page
    // Changed timeout to be slightly shorter.
    if (interactiveText && !isButtonSpeaking)
      setTimeout(() => {
        handleSpeak();
      }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(exerciseBookmark);
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      {/* Instructions - visible during exercise, invisible when showing solution but still take space */}
      <div className="headlineWithMoreSpace">
        {strings.audioExerciseHeadline}
      </div>

      {/* Context - always at the top, never moves */}
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

      {/* Button/Solution area - maintain consistent height, placed below context */}
      <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2em' }}>
        {!isExerciseOver ? (
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={exerciseBookmark}
              styling="large"
              parentIsSpeakingControl={isButtonSpeaking}
            />
          </s.CenteredRowTall>
        ) : (
          <>
            <h1 className="wordInContextHeadline" style={{ margin: '0.25em 0' }}>
              {removePunctuation(exerciseBookmark.to)}
            </h1>
            {bookmarkProgressBar}
          </>
        )}
      </div>

      {/* Bottom input - only during exercise */}
      {!isExerciseOver && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
        />
      )}
    </s.Exercise>
  );
}
