import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import shuffle from "../../../assorted/fisherYatesShuffle";

import NextNavigation from "../NextNavigation";
import MatchInput from "./MatchInput.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";

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
  activeSessionDuration,
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

  const [messageToNextNav, setMessageToNextNav] = useState("");
  const [firstPressTime, setFirstPressTime] = useState();
  const [currentBookmarksToStudy, setcurrentBookmarksToStudy] =
    useState(initialBookmarkState);
  const [fromButtonOptions, setFromButtonOptions] = useState(null);
  const [toButtonOptions, setToButtonOptions] = useState(null);
  const [buttonsToDisable, setButtonsToDisable] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setButtonsToDisable([]);
    setFromButtonOptions(null);
    setToButtonOptions(null);
    setButtonOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function inputFirstClick() {
    if (firstPressTime === undefined) setFirstPressTime(new Date());
  }

  function notifyChoiceSelection(firstChoice, secondChoice) {
    console.log("checking result...");
    let bookmarksCopy = { ...currentBookmarksToStudy };
    let i;
    let fullMessage = messageToNextNav;
    for (i = 0; i < bookmarksToStudy.length; i++) {
      let currentBookmark = bookmarksCopy[i];
      if (buttonsToDisable.length === 2) {
        fullMessage = fullMessage + "C";
        setIsCorrect(true);
        break;
      } else if (currentBookmark.bookmark.id === Number(firstChoice)) {
        if (firstChoice === secondChoice) {
          setButtonsToDisable((arr) => [...arr, firstChoice]);
          let concatMessage = currentBookmark.messageToAPI + "C";
          fullMessage = fullMessage + concatMessage;
          bookmarksCopy[i].messageToAPI = concatMessage;
          setcurrentBookmarksToStudy(bookmarksCopy);
          correctAnswer(currentBookmark.bookmark);
          handleAnswer(concatMessage, currentBookmark.bookmark.id);
        } else {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmark.bookmark);
          let concatMessage = currentBookmark.messageToAPI + "W";
          fullMessage = fullMessage + concatMessage;
          bookmarksCopy[i].messageToAPI = concatMessage;
          setcurrentBookmarksToStudy(bookmarksCopy);
        }
      } else if (currentBookmark.bookmark.id === Number(secondChoice)) {
        if (firstChoice !== secondChoice) {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmark.bookmark);
          let concatMessage = currentBookmark.messageToAPI + "W";
          fullMessage = fullMessage + concatMessage;
          bookmarksCopy[i].messageToAPI = concatMessage;
          setcurrentBookmarksToStudy(bookmarksCopy);
        }
      }
    }
    setMessageToNextNav(fullMessage);
  }

  function handleShowSolution() {
    let finalMessage = "";
    for (let i = 0; i < bookmarksToStudy.length; i++) {
      if (!currentBookmarksToStudy[i].messageToAPI.includes("C")) {
        notifyIncorrectAnswer(currentBookmarksToStudy[i].bookmark);
        let concatMessage = currentBookmarksToStudy[i].messageToAPI + "S";
        finalMessage += concatMessage;
        api.uploadExerciseFinalizedData(
          concatMessage,
          EXERCISE_TYPE,
          getCurrentSubSessionDuration(activeSessionDuration, "ms"),
          currentBookmarksToStudy[i].bookmark.id,
          exerciseSessionId,
        );
      }
    }
    setIsCorrect(true);
    setMessageToNextNav(finalMessage);
  }

  function handleAnswer(message, id) {
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      id,
      exerciseSessionId,
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
    console.log(shuffledOptions);
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
      <NextNavigation
        message={messageToNextNav}
        api={api}
        bookmarksToStudy={initialBookmarkState}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
