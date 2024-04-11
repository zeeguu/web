import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../findWordInContext/BottomInput.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import NextNavigation from "../NextNavigation.js";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks.js";

import SessionStorage from "../../../assorted/SessionStorage.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import DisableAudioSession from "../DisableAudioSession.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";

const EXERCISE_TYPE = "Spell_What_You_Hear";
export default function SpellWhatYouHear({
  api,
  bookmarksToStudy,
  correctAnswer,
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
  const bookmarkToStudy = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState();
  const [articleInfo, setArticleInfo] = useState();
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );

  async function handleSpeak() {
    await speech.speakOut(bookmarkToStudy.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo,
          api,
          "TRANSLATE WORDS IN EXERCISE",
          EXERCISE_TYPE,
          speech,
        ),
      );
      setArticleInfo(articleInfo);
    });
    if (!SessionStorage.isAudioExercisesEnabled()) handleDisabledAudio();
  }, []);

  useEffect(() => {
    // Timeout is set so that the page renders before the word is spoken, allowing for the user to gain focus on the page
    // Changed timeout to be slightly shorter.
    setTimeout(() => {
      handleSpeak();
    }, 300);
  }, [articleInfo]);

  function handleShowSolution(e, message) {
    e.preventDefault();
    let concatMessage;
    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }

    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setMessageToAPI(concatMessage);
    api.uploadExerciseFinalizedData(
      concatMessage,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function disableAudio(e) {
    e.preventDefault();
    SessionStorage.disableAudioExercises();
    handleDisabledAudio();
  }

  function handleDisabledAudio() {
    api.logUserActivity("AUDIO_DISABLE", "", bookmarksToStudy[0].id, "");
    moveToNextExercise();
  }
  function handleIncorrectAnswer() {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(bookmarksToStudy[0]);
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    correctAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.audioExerciseHeadline}
      </div>
      {!isCorrect && (
        <>
          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={bookmarksToStudy[0].from}
            />
          </div>
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              styling="large"
              parentIsSpeakingControl={isButtonSpeaking}
            />
          </s.CenteredRowTall>

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
          <h1 className="wordInContextHeadline">{bookmarksToStudy[0].to}</h1>
          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={bookmarksToStudy[0].from}
            />
          </div>
        </>
      )}
      <NextNavigation
        api={api}
        message={messageToAPI}
        bookmarksToStudy={bookmarksToStudy}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
      {SessionStorage.isAudioExercisesEnabled() && (
        <DisableAudioSession disableAudio={disableAudio} />
      )}
    </s.Exercise>
  );
}
