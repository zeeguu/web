import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";

import NextNavigation from "../NextNavigation";
import MatchInput from "./MatchInput.js";

const EXERCISE_TYPE = "Match_three_L1W_to_three_L2W";

export default function Match({
  api,
  bookmarkToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
  shuffle,
}) {
  const initialBookmarkState = [
    {
      bookmark: bookmarkToStudy[0],
      messageToAPI: "",
    },
    {
      bookmark: bookmarkToStudy[1],
      messageToAPI: "",
    },
    {
      bookmark: bookmarkToStudy[2],
      messageToAPI: "",
    },
  ];

  const [initialTime] = useState(new Date());
  const [firstPressTime, setFirstPressTime] = useState();
  const [bookmarksToStudy, setBookmarksToStudy] =
    useState(initialBookmarkState);
  const [fromButtonOptions, setFromButtonOptions] = useState(null);
  const [toButtonOptions, setToButtonOptions] = useState(null);
  const [buttonsToDisable, setButtonsToDisable] = useState([]);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isMatch, setIsMatch] = useState(false);

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
    let bookmarksCopy = { ...bookmarksToStudy };
    let i;
    for (i = 0; i < bookmarkToStudy.length; i++) {
      let currentBookmark = bookmarksCopy[i];
      if (currentBookmark.bookmark.id === Number(firstChoice)) {
        if (firstChoice === secondChoice) {
          setIsMatch(true);
          setButtonsToDisable((arr) => [...arr, firstChoice]);
          let concatMessage = currentBookmark.messageToAPI + "C";
          bookmarksCopy[i].messageToAPI = concatMessage;
          setBookmarksToStudy(bookmarksCopy);
          correctAnswer(currentBookmark.bookmark);
          handleAnswer(concatMessage, currentBookmark.bookmark.id);
          if (buttonsToDisable.length === 1) {
            setIsCorrect(true);
          }
        } else {
          setIsIncorrect(true);
          notifyIncorrectAnswer(currentBookmark.bookmark);
          let concatMessage = currentBookmark.messageToAPI + "W";
          bookmarksCopy[i].messageToAPI = concatMessage;
          setBookmarksToStudy(bookmarksCopy);
        }
        break;
      }
    }
  }

  function handleAnswer(message, id) {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");

    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      pressTime - initialTime,
      id
    );
  }

  function setButtonOptions() {
    setFromButtonOptions(bookmarkToStudy);
    let optionsToShuffle = [
      bookmarksToStudy[0].bookmark,
      bookmarksToStudy[1].bookmark,
      bookmarksToStudy[2].bookmark,
    ];
    let shuffledOptions = shuffle(optionsToShuffle);
    setToButtonOptions(shuffledOptions);
  }

  return (
    <s.Exercise>
      <h3>{strings.matchWordWithTranslation}</h3>

      <MatchInput
        fromButtonOptions={fromButtonOptions}
        toButtonOptions={toButtonOptions}
        notifyChoiceSelection={notifyChoiceSelection}
        inputFirstClick={inputFirstClick}
        buttonsToDisable={buttonsToDisable}
        isCorrect={isCorrect}
        api={api}
        isIncorrect={isIncorrect}
        setIsIncorrect={setIsIncorrect}
        isMatch={isMatch}
        setIsMatch={setIsMatch}
      />

      {isCorrect && (
        <NextNavigation
          api={api}
          bookmarkToStudy={toButtonOptions}
          moveToNextExercise={moveToNextExercise}
        />
      )}
    </s.Exercise>
  );
}
