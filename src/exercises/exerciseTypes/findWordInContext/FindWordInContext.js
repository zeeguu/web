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

  function handleCorrectAnswer(message) {
    console.log(new Date() - initialTime);
    console.log("^^^^ time elapsed");
    console.log(firstTypeTime - initialTime);
    console.log("^^^^ to first key press");

    console.log(message);
    setIsCorrect(true);
    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      firstTypeTime - initialTime,
      bookmarkToStudy.id
    );
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer();
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
          bookmarkToStudy={bookmarkToStudy}
          notifyKeyPress={inputKeyPress}
          handleIncorrectAnswer={handleIncorrectAnswer}
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
