import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import NextNavigation from "../NextNavigation.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import DisableAudioSession from "../DisableAudioSession.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import LearningCycleIndicator from "../../LearningCycleIndicator.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";

// The user has to write the word they hear. A context with the word omitted is shown.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.spellWhatYouHear;

export default function SpellWhatYouHear({
  api,
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
  toggleShow,
  reload,
  setReload,
  exerciseSessionId,
  activeSessionDuration,
}) {
  const [messageToAPI, setMessageToAPI] = useState("");
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState();
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);
  const exerciseBookmark = bookmarksToStudy[0];

  async function handleSpeak() {
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.article_id,
        false,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
      ),
    );
    if (!SessionStorage.isAudioExercisesEnabled()) handleDisabledAudio();
  }, [isBookmarkChanged]);

  useEffect(() => {
    // Timeout is set so that the page renders before the word is spoken, allowing for the user to gain focus on the page
    // Changed timeout to be slightly shorter.
    setTimeout(() => {
      handleSpeak();
    }, 300);
  }, [interactiveText]);

  function handleShowSolution(e, message) {
    e.preventDefault();
    let concatMessage;
    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }

    notifyIncorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    setMessageToAPI(concatMessage);
    api.uploadExerciseFinalizedData(
      concatMessage,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exerciseBookmark.id,
      exerciseSessionId,
    );
  }

  function handleDisabledAudio() {
    api.logUserActivity(api.AUDIO_DISABLE, "", exerciseBookmark.id, "");
    moveToNextExercise();
  }

  function handleIncorrectAnswer() {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(exerciseBookmark);
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    notifyCorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exerciseBookmark.id,
      exerciseSessionId,
    );
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.audioExerciseHeadline}
      </div>
      <LearningCycleIndicator
        bookmark={bookmarksToStudy[0]}
        message={messageToAPI}
      />

      {!isCorrect && (
        <>
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={exerciseBookmark}
              api={api}
              styling="large"
              parentIsSpeakingControl={isButtonSpeaking}
            />
          </s.CenteredRowTall>
          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={exerciseBookmark.from}
            />
          </div>

          <BottomInput
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            bookmarksToStudy={bookmarksToStudy}
            messageToAPI={messageToAPI}
            setMessageToAPI={setMessageToAPI}
          />
        </>
      )}
      {isCorrect && (
        <>
          <br></br>
          <h1 className="wordInContextHeadline">
            {removePunctuation(exerciseBookmark.to)}
          </h1>
          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={exerciseBookmark.from}
            />
          </div>
        </>
      )}
      <NextNavigation
        exerciseType={EXERCISE_TYPE}
        api={api}
        message={messageToAPI}
        exerciseBookmark={exerciseBookmark}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
        isBookmarkChanged={() => setIsBookmarkChanged(!isBookmarkChanged)}
      />
      {SessionStorage.isAudioExercisesEnabled() && (
        <DisableAudioSession
          handleDisabledAudio={handleDisabledAudio}
          setIsCorrect={setIsCorrect}
        />
      )}
    </s.Exercise>
  );
}
