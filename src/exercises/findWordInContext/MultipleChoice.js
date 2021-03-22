import { useState } from "react";
import * as s from "./FindWordInContext.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";

import BottomFeedback from "./BottomFeedback";

const EXERCISE_TYPE = "MULTIPLE_CHOICE";

export default function MultipleChoice({
  api,
  bookmarkToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
}) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsincorrect] = useState(false);
  const [initialTime] = useState(new Date());
  const [firstTypeTime, setFirstTypeTime] = useState();

  // get random words from API
  let randomWords = ["foo", "bar"];

  function colorWordInContext(context, word) {
    return context.replace(
      word,
      `<span class='highlightedWord'>${word}</span>`
    );
  }

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === bookmarkToStudy.from) {
      setIsCorrect(true);
    } else {
      setIsincorrect(true);
    }
  }

  function notifyIncorrectAnswer() {}

  function handleCorrectAnswer() {
    console.log(new Date() - initialTime);
    console.log("^^^^ time elapsed");
    console.log(firstTypeTime - initialTime);
    console.log("^^^^ to first key press");

    setIsCorrect(true);
    api.uploadExerciseFeedback(
      "Correct",
      EXERCISE_TYPE,
      firstTypeTime - initialTime,
      bookmarkToStudy.id
    );
  }

  console.log(bookmarkToStudy);

  function contextWithMissingWord(context, missingWord) {
    // what happens if a word appears twice?
    // make sure that parts of words don't get matched
    return context.replace(missingWord, "______");
  }

  return (
    <s.FindWordInContext>
      <h3>Select the missing word</h3>
      <div className="contextExample">
        {contextWithMissingWord(bookmarkToStudy.context, bookmarkToStudy.from)}
      </div>

      <MultipleChoicesInput
        handleCorrectAnswer={handleCorrectAnswer}
        bookmarkToStudy={bookmarkToStudy}
        randomWords={randomWords}
        notifyChoiceSelection={notifyChoiceSelection}
        notifyIncorrectAnswer={notifyIncorrectAnswer}
      />

      {isIncorrect && <div>Try again</div>}

      {isCorrect && (
        <BottomFeedback
          bookmarkToStudy={bookmarkToStudy}
          correctAnswer={correctAnswer}
        />
      )}
    </s.FindWordInContext>
  );
}
