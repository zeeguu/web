import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import shuffle from "../../../assorted/fisherYatesShuffle";

import NextNavigation from "../NextNavigation";
import MatchInput from "./MatchInput.js";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks";

const EXERCISE_TYPE = "Match_three_L1W_to_three_L2W";

export default function Match({
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
}) {
  const initialBookmarkState = [
    {
      bookmark: bookmarksToStudy[0],
      messageToAPI: "",
    },
    {
      bookmark: bookmarksToStudy[1],
      messageToAPI: "",
    },
    {
      bookmark: bookmarksToStudy[2],
      messageToAPI: "",
    },
  ];

  const [initialTime] = useState(new Date());
  const [firstPressTime, setFirstPressTime] = useState();
  const [currentBookmarksToStudy, setcurrentBookmarksToStudy] =
    useState(initialBookmarkState);
  const [fromButtonOptions, setFromButtonOptions] = useState(null);
  const [toButtonOptions, setToButtonOptions] = useState(null);
  const [buttonsToDisable, setButtonsToDisable] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setButtonsToDisable([]);
    setFromButtonOptions(null);
    setToButtonOptions(null);
    setButtonOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exerciseDuration(endTime) {
    return Math.min(89999, endTime - initialTime);
  }

  function inputFirstClick() {
    if (firstPressTime === undefined) setFirstPressTime(new Date());
  }

  function notifyChoiceSelection(firstChoice, secondChoice) {
    console.log("checking result...");
    let bookmarksCopy = { ...currentBookmarksToStudy };
    let i;
    for (i = 0; i < bookmarksToStudy.length; i++) {
      let currentBookmark = bookmarksCopy[i];
      if (buttonsToDisable.length === 2) {
        setIsCorrect(true);
        break;
      } else if (currentBookmark.bookmark.id === Number(firstChoice)) {
        if (firstChoice === secondChoice) {
          setButtonsToDisable((arr) => [...arr, firstChoice]);
          let concatMessage = currentBookmark.messageToAPI + "C";
          bookmarksCopy[i].messageToAPI = concatMessage;
          setcurrentBookmarksToStudy(bookmarksCopy);
          correctAnswer(currentBookmark.bookmark);
          handleAnswer(concatMessage, currentBookmark.bookmark.id);
        } else {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmark.bookmark);
          let concatMessage = currentBookmark.messageToAPI + "W";
          bookmarksCopy[i].messageToAPI = concatMessage;
          setcurrentBookmarksToStudy(bookmarksCopy);
        }
      } else if (currentBookmark.bookmark.id === Number(secondChoice)) {
        if (firstChoice !== secondChoice) {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmark.bookmark);
          let concatMessage = currentBookmark.messageToAPI + "W";
          bookmarksCopy[i].messageToAPI = concatMessage;
          setcurrentBookmarksToStudy(bookmarksCopy);
        }
      }
    }
  }

  function handleShowSolution() {
    let pressTime = new Date();
    let duration = exerciseDuration(pressTime);

    for (let i = 0; i < bookmarksToStudy.length; i++) {
      if (!currentBookmarksToStudy[i].messageToAPI.includes("C")) {
        notifyIncorrectAnswer(currentBookmarksToStudy[i].bookmark);
        let concatMessage = currentBookmarksToStudy[i].messageToAPI + "S";

        api.uploadExerciseFinalizedData(
          concatMessage,
          EXERCISE_TYPE,
          duration,
          currentBookmarksToStudy[i].bookmark.id,
          exerciseSessionId
        );
      }
    }
    setIsCorrect(true);
  }

  function handleAnswer(message, id) {
    let pressTime = new Date();

    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      exerciseDuration(pressTime),
      id,
      exerciseSessionId
    );
  }

  function setButtonOptions() {
    setFromButtonOptions(bookmarksToStudy);
    let optionsToShuffle = [
      currentBookmarksToStudy[0].bookmark,
      currentBookmarksToStudy[1].bookmark,
      currentBookmarksToStudy[2].bookmark,
    ];
    let shuffledOptions = shuffle(optionsToShuffle);
    setToButtonOptions(shuffledOptions);
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.matchWordWithTranslation}{" "}
      </div>

      <MatchInput
        fromButtonOptions={fromButtonOptions}
        toButtonOptions={toButtonOptions}
        notifyChoiceSelection={notifyChoiceSelection}
        inputFirstClick={inputFirstClick}
        buttonsToDisable={buttonsToDisable}
        isCorrect={isCorrect}
        api={api}
        incorrectAnswer={incorrectAnswer}
        setIncorrectAnswer={setIncorrectAnswer}
        reload={reload}
        setReload={setReload}
      />

      {isCorrect && (
        <NextNavigation
          api={api}
          bookmarksToStudy={toButtonOptions}
          moveToNextExercise={moveToNextExercise}
        />
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
