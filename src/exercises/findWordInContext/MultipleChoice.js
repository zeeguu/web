import { useState } from "react";
import * as s from "./Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";

import BottomFeedback from "./BottomFeedback";

const EXERCISE_TYPE = "MULTIPLE_CHOICE";

export default function MultipleChoice({
  api,
  bookmarkToStudy,
  otherBookmarksToStudyList,
  correctAnswer,
  notifyIncorrectAnswer,
}) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsincorrect] = useState(false);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [initialTime] = useState(new Date());
  const [firstPressTime, setFirstPressTime] = useState();

  function colorWordInContext(context, word) {
    return context.replace(
      word,
      `<span class='highlightedWord'>${word}</span>`
    );
  }

  function notifyChoiceSelection(selectedChoice) {
    if (firstPressTime === undefined) setFirstPressTime(new Date());
    if (selectedChoice === bookmarkToStudy.from) {
      handleCorrectAnswer();
    } else {
      setIncorrectAnswer(selectedChoice);
      handleIncorrectAnswer();
    }
  }

  function handleIncorrectAnswer() {
    setIsincorrect(true);
    notifyIncorrectAnswer();
  }

  function handleCorrectAnswer() {
    console.log(new Date() - initialTime);
    console.log("^^^^ time elapsed");
    console.log(firstPressTime - initialTime);
    console.log("^^^^ to first button press");

    setIsCorrect(true);
    api.uploadExerciseFeedback(
      "Correct",
      EXERCISE_TYPE,
      firstPressTime - initialTime,
      bookmarkToStudy.id
    );
  }

  function contextWithMissingWord(context, missingWord) {
    return context.replace(missingWord, "______");
  }

  return (
    <s.Exercise>
      <h3>Choose the word that fits the context</h3>
      <div className="contextExample">
        <div
          dangerouslySetInnerHTML={{
            __html: isCorrect
              ? colorWordInContext(
                  bookmarkToStudy.context,
                  bookmarkToStudy.from
                )
              : contextWithMissingWord(
                  bookmarkToStudy.context,
                  bookmarkToStudy.from
                ),
          }}
        />
      </div>

      {!isCorrect && (
        <MultipleChoicesInput
          bookmarkToStudy={bookmarkToStudy}
          otherBookmarksToStudyList={otherBookmarksToStudyList}
          notifyChoiceSelection={notifyChoiceSelection}
          isIncorrect={isIncorrect}
          incorrectAnswer={incorrectAnswer}
        />
      )}
      {isCorrect && (
        <BottomFeedback
          bookmarkToStudy={bookmarkToStudy}
          correctAnswer={correctAnswer}
        />
      )}
    </s.Exercise>
  );
}
