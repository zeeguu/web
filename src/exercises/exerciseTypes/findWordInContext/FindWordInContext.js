import { useState } from "react";
import * as s from "../Exercise.sc.js";

import BottomInput from "./BottomInput";

import strings from "../../../i18n/definitions";
import BottomFeedback from "../BottomFeedback";

const EXERCISE_TYPE = "Recognize_L1W_in_L2T";
export default function FindWordInContext({
  api,
  bookmarkToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
}) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [initialTime] = useState(new Date());
  const [firstTypeTime, setFirstTypeTime] = useState();

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

  function handleShowSolution() {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");

    notifyIncorrectAnswer();
    setIsCorrect(true);

    api.uploadExerciseFeedback(
      "S",
      EXERCISE_TYPE,
      pressTime - initialTime,
      bookmarkToStudy.id
    );
  }

  function handleAnswer(message) {
    console.log(new Date() - initialTime);
    console.log("^^^^ time elapsed");
    console.log(firstTypeTime - initialTime);
    console.log("^^^^ to first key press");

    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      firstTypeTime - initialTime,
      bookmarkToStudy.id
    );
  }

  function handleCorrectAnswer(message) {
    setIsCorrect(true);
    handleAnswer(message);
  }

  function handleIncorrectAnswer(message) {
    notifyIncorrectAnswer();
    handleAnswer(message);
    setFirstTypeTime();
  }

  function handleHint(message) {
    let hintTime = new Date();
    console.log(hintTime - initialTime);
    console.log("^^^^ time elapsed");

    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      hintTime - initialTime,
      bookmarkToStudy.id
    );
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
          handleHintUse={handleHint}
          handleShowSolution={handleShowSolution}
          bookmarkToStudy={bookmarkToStudy}
          notifyKeyPress={inputKeyPress}
        />
      )}
      {isCorrect && (
        <BottomFeedback
          api={api}
          bookmarkToStudy={bookmarkToStudy}
          correctAnswer={correctAnswer}
        />
      )}
    </s.Exercise>
  );
}
