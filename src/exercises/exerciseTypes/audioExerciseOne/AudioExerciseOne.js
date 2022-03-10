import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import BotInput from "./BotInput";
import SpeakButton from "../SpeakButton";
import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks";
import ZeeguuSpeech from "../../../speech/ZeeguuSpeech.js";

const EXERCISE_TYPE = "TypeL2W_in_AudioL2";
export default function AudioExerciseOne({
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
}) {
  const [initialTime] = useState(new Date());
  const [firstTypeTime, setFirstTypeTime] = useState();
  const [messageToAPI, setMessageToAPI] = useState("");

  const bookmarkToStudy = bookmarksToStudy[0];

  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));

  async function handleSpeak() {
    await speech.speakOut(bookmarkToStudy.from);
  }

  useEffect(() => {
    setTimeout(() => {
      handleSpeak();
    }, 500);
    setExerciseType(EXERCISE_TYPE);
  });

  function inputKeyPress() {
    if (firstTypeTime === undefined) {
      setFirstTypeTime(new Date());
    }
  }

  function handleShowSolution(e, message) {
    e.preventDefault();
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    let duration = pressTime - initialTime;
    let concatMessage = "";
    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }

    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFeedback(
      concatMessage,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );
  }

  function handleCorrectAnswer(message) {
    console.log(new Date() - initialTime);
    console.log(firstTypeTime - initialTime);
    let duration = firstTypeTime - initialTime;

    correctAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setFirstTypeTime();
  }

  return (
    <s.Exercise>
      <div className="headline">{strings.audioExerciseHeadline}</div>
      {!isCorrect && (
        <>
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              styling="large"
            />
          </s.CenteredRowTall>

          <BotInput
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            bookmarksToStudy={bookmarksToStudy}
            notifyKeyPress={inputKeyPress}
            messageToAPI={messageToAPI}
            setMessageToAPI={setMessageToAPI}
          />
        </>
      )}
      {isCorrect && (
        <>
          <h1>{bookmarksToStudy[0].from}</h1>
          <NextNavigation
            api={api}
            bookmarksToStudy={bookmarksToStudy}
            moveToNextExercise={moveToNextExercise}
            reload={reload}
            setReload={setReload}
          />
        </>
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
