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
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to translate the word they hear into their L1.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.translateWhatYouHear;
export default function TranslateWhatYouHear({
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
  const api = useContext(APIContext);
  const [messageToAPI, setMessageToAPI] = useState("");
  const exerciseBookmark = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState();
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);

  async function handleSpeak() {
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
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
    if (!SessionStorage.isAudioExercisesEnabled()) handleDisabledAudio();
    // eslint-disable-next-line
  }, [isBookmarkChanged, exerciseBookmark]);

  useEffect(() => {
    if (interactiveText && !isButtonSpeaking)
      setTimeout(() => {
        handleSpeak();
      }, 200);
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
        {strings.translateWhatYouHearHeadline}
      </div>
      <BookmarkProgressBar bookmark={exerciseBookmark} message={messageToAPI} />
      {!isCorrect && (
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
              isCorrect={isCorrect}
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
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            bookmarksToStudy={bookmarksToStudy}
            messageToAPI={messageToAPI}
            setMessageToAPI={setMessageToAPI}
            isL1Answer={true}
            exerciseType={EXERCISE_TYPE}
          />
        </>
      )}

      {isCorrect && (
        <>
          <br></br>
          <h1 className="wordInContextHeadline">{exerciseBookmark.to}</h1>
          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
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
      <NextNavigation
        exerciseType={EXERCISE_TYPE}
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
