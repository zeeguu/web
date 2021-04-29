import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";

import BottomFeedback from "../BottomFeedback";
import MatchInput from "./MatchInput.js";

const EXERCISE_TYPE = "MATCH";

export default function Match({
  api,
  bookmarksToStudyList,
  notifyIncorrectAnswer,
  currentIndex,
  correctAnswer,
}) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [initialTime] = useState(new Date());
  const [firstPressTime, setFirstPressTime] = useState();
  const [fromButtonOptions, setFromButtonOptions] = useState(null);
  const [toButtonOptions, setToButtonOptions] = useState(null);
  const [buttonsToDisable, setButtonsToDisable] = useState([]);

  //TODO: Have button colors as constants - not only in CSS (see name your bébé on GitHub for reference)

  useEffect(() => {
    setButtonsToDisable([]);
    setFromButtonOptions(null);
    setToButtonOptions(null);
    setButtonOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  function inputFirstClick() {
    if (firstPressTime === undefined) setFirstPressTime(new Date());
  }

  function notifyChoiceSelection(firstChoice, secondChoice) {
    console.log("checking result...");
    if (firstChoice === secondChoice) {
      setButtonsToDisable((arr) => [...arr, firstChoice]);
      if (buttonsToDisable.length <= 2) {
        handleCorrectAnswer(Number(firstChoice));
      }
    } else {
      handleIncorrectAnswer(Number(firstChoice));
    }
  }

  function handleCorrectAnswer(id) {
    let correctPressTime = new Date();
    console.log(correctPressTime - initialTime);
    console.log("^^^^ time elapsed");

    if (buttonsToDisable.length === 2) {
      setIsCorrect(true);
    }

    api.uploadExerciseFeedback(
      "Correct",
      EXERCISE_TYPE,
      correctPressTime - initialTime,
      id
    );
  }

  function handleIncorrectAnswer(id) {
    let incorrectPressTime = new Date();
    console.log(incorrectPressTime - initialTime);
    console.log("^^^^ time elapsed");

    notifyIncorrectAnswer(id);
    api.uploadExerciseFeedback(
      "Incorrect",
      EXERCISE_TYPE,
      incorrectPressTime - initialTime,
      id
    );
  }

  function setButtonOptions() {
    let threeOptions = chooseThreeOptions();
    setFromButtonOptions(threeOptions);
    let optionsToShuffle = [threeOptions[0], threeOptions[1], threeOptions[2]];
    let shuffledOptions = shuffle(optionsToShuffle);
    setToButtonOptions(shuffledOptions);
  }

  function chooseThreeOptions() {
    if (currentIndex === 0) {
      let threeCurrentBookmarks = [
        bookmarksToStudyList[currentIndex],
        bookmarksToStudyList[currentIndex + 1],
        bookmarksToStudyList[currentIndex + 2],
      ];
      return threeCurrentBookmarks;
    } else {
      let threeCurrentBookmarks = [
        bookmarksToStudyList[currentIndex],
        bookmarksToStudyList[currentIndex - 1],
        bookmarksToStudyList[currentIndex - 2],
      ];
      return threeCurrentBookmarks;
    }
  }

  //TODO: Move shuffle out of Match & MultipleChoice

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
      <h3>Match each word with its translation</h3>
      {!isCorrect && (
        <MatchInput
          fromButtonOptions={fromButtonOptions}
          toButtonOptions={toButtonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          inputFirstClick={inputFirstClick}
          buttonsToDisable={buttonsToDisable}
        />
      )}
      {isCorrect && (
        <div>
          <MatchInput
            fromButtonOptions={fromButtonOptions}
            toButtonOptions={toButtonOptions}
            notifyChoiceSelection={notifyChoiceSelection}
            inputFirstClick={inputFirstClick}
            buttonsToDisable={buttonsToDisable}
          />
          <BottomFeedback
            bookmarkToStudy={toButtonOptions}
            correctAnswer={correctAnswer}
          />
        </div>
      )}
    </s.Exercise>
  );
}
