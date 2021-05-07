import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";

import BottomFeedback from "../BottomFeedback";

const EXERCISE_TYPE = "MULTIPLE_CHOICE";

export default function MultipleChoice({
  api,
  bookmarkToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
}) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [initialTime] = useState(new Date());
  const [buttonOptions, setButtonOptions] = useState(null);

  useEffect(() => {
    api.wordsSimilarTo(bookmarkToStudy.id, (words) => {
      consolidateChoiceOptions(words);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function colorWordInContext(context, word) {
    return context.replace(
      word,
      `<span class='highlightedWord'>${word}</span>`
    );
  }

  function notifyChoiceSelection(selectedChoice) {
    console.log("checking result...");
    if (selectedChoice === bookmarkToStudy.from) {
      handleCorrectAnswer();
    } else {
      setIncorrectAnswer(selectedChoice);
      handleIncorrectAnswer();
    }
  }

  function handleCorrectAnswer() {
    let correctPressTime = new Date();
    console.log(correctPressTime - initialTime);
    console.log("^^^^ time elapsed");

    setIsCorrect(true);
    api.uploadExerciseFeedback(
      "Correct",
      EXERCISE_TYPE,
      correctPressTime - initialTime,
      bookmarkToStudy.id
    );
  }

  function handleIncorrectAnswer() {
    let incorrectPressTime = new Date();
    console.log(incorrectPressTime - initialTime);
    console.log("^^^^ time elapsed");

    notifyIncorrectAnswer();
    api.uploadExerciseFeedback(
      "Incorrect",
      EXERCISE_TYPE,
      incorrectPressTime - initialTime,
      bookmarkToStudy.id
    );
  }

  function contextWithMissingWord(context, missingWord) {
    return context.replace(missingWord, "______");
  }

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      bookmarkToStudy.from,
      similarWords[firstRandomInt],
      similarWords[secondRandomInt],
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);
    setButtonOptions(shuffledListOfOptions);
  }

  /*Fisher-Yates (aka Knuth) Shuffle - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array*/
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  return (
    <s.Exercise>
      <h3>Choose the word that fits the context</h3>
      {isCorrect && <h1>{bookmarkToStudy.to}</h1>}
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
      {!buttonOptions && <LoadingAnimation />}
      {!isCorrect && (
        <MultipleChoicesInput
          buttonOptions={buttonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
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
