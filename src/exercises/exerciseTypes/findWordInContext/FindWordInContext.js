import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";

import BottomInput from "./BottomInput";

import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";

const EXERCISE_TYPE = "Recognize_L1W_in_L2T";
export default function FindWordInContext({
  api,
  bookmarkToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
}) {
  const [initialTime] = useState(new Date());
  const [firstTypeTime, setFirstTypeTime] = useState();

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function colorWordInContext(context, word) {
    return context.replace(
      word,
      `<span class='highlightedWord'>${word}</span>`
    );
  }

  function inputKeyPress() {
    if (firstTypeTime === undefined) {
      setFirstTypeTime(new Date());
    }
  }

  function handleShowSolution(message) {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    let duration = pressTime - initialTime;

    notifyIncorrectAnswer(bookmarkToStudy);
    setIsCorrect(true);
    handleAnswer(message, duration);
  }

  function handleAnswer(message, duration) {
    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      duration,
      bookmarkToStudy.id
    );
  }

  function handleCorrectAnswer(message) {
    console.log(new Date() - initialTime);
    console.log("^^^^ time elapsed");
    console.log(firstTypeTime - initialTime);
    console.log("^^^^ to first key press");
    let duration = firstTypeTime - initialTime;

    correctAnswer(bookmarkToStudy);
    setIsCorrect(true);
    handleAnswer(message, duration);
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(bookmarkToStudy);
    setFirstTypeTime();
  }

  return (
    <s.Exercise>
      <h3>{strings.findTheWordInContextHeadline}</h3>
      <h1>{bookmarkToStudy.to}</h1>
      <div className="contextExample">
        <div
          dangerouslySetInnerHTML={{
            __html: isCorrect
              ? colorWordInContext(
                  bookmarkToStudy.context,
                  bookmarkToStudy.from
                )
              : bookmarkToStudy.context,
          }}
        />
      </div>

      {!isCorrect && (
        <BottomInput
          handleCorrectAnswer={handleCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          handleShowSolution={handleShowSolution}
          bookmarkToStudy={bookmarkToStudy}
          notifyKeyPress={inputKeyPress}
        />
      )}
      {isCorrect && (
        <NextNavigation
          api={api}
          bookmarkToStudy={bookmarkToStudy}
          moveToNextExercise={moveToNextExercise}
        />
      )}
    </s.Exercise>
  );
}
