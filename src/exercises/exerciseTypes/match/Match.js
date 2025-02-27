import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import NextNavigation from "../NextNavigation";
import MatchInput from "./MatchInput.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import { toast } from "react-toastify";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression.js";
import useBookmarkAutoPronounce from "../../../hooks/useBookmarkAutoPronounce.js";

// The user has to match three L1 words to their correct L2 translations.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.match;

export default function Match({
  api,
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  notifyExerciseCompleted,
  setIsExerciseOver,
  reload,
  setReload,
  resetSubSessionTimer,
}) {
  // ML: TODO: this duplicates a bit the information in bookmarksToStudy
  // It should be possible to implement with a simple array of messageToAPI that will
  // always be in sync with bookmarksToStudy, i.e. messageToAPI[0] refers to the state of bookmarksToStudy[0], etc.
  const initialExerciseAttemptsLog = [
    {
      bookmark: bookmarksToStudy[0],
      messageToAPI: "",
      isLast: false,
    },
    {
      bookmark: bookmarksToStudy[1],
      messageToAPI: "",
      isLast: false,
    },
    {
      bookmark: bookmarksToStudy[2],
      messageToAPI: "",
      isLast: false,
    },
  ];

  const [messageToNextNav, setMessageToNextNav] = useState("");
  const [firstPressTime, setFirstPressTime] = useState();
  const [exerciseAttemptsLog, setexerciseAttemptsLog] = useState(
    initialExerciseAttemptsLog,
  );
  const [fromButtonOptions, setFromButtonOptions] = useState(null);
  const [toButtonOptions, setToButtonOptions] = useState(null);
  const [buttonsToDisable, setButtonsToDisable] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [autoPronounceBookmark] = useBookmarkAutoPronounce();
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [lastCorrectBookmarkId, setLastCorrectBookmarkId] = useState(null);
  const [selectedBookmark, setSelectedBookmark] = useState();
  const [selectedBookmarkMessage, setSelectedBookmarkMessage] = useState("");

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setButtonsToDisable([]);
    setFromButtonOptions(null);
    setToButtonOptions(null);
    setButtonOptions();
    resetSubSessionTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function inputFirstClick() {
    if (firstPressTime === undefined) setFirstPressTime(new Date());
  }

  const speech = useContext(SpeechContext);

  async function handleSpeak(bookmark) {
    if (autoPronounceBookmark) {
      await speech.speakOut(bookmark.from, setIsPronouncing);
    }
  }

  useEffect(() => {
    for (let i = 0; i < bookmarksToStudy.length; i++) {
      let currentBookmarkLog = exerciseAttemptsLog[i];
      if (selectedBookmark == currentBookmarkLog.bookmark)
        setSelectedBookmarkMessage(currentBookmarkLog.messageToAPI);
    }
  }, [selectedBookmark]);

  useEffect(() => {});

  function notifyBookmarkDeletion(bookmark) {
    let word_expression = "";
    if (isBookmarkExpression(bookmark)) word_expression = "expression";
    else word_expression = "word";
    toast.success(`The ${word_expression} '${bookmark.from}' is deleted!`);
  }

  function notifyChoiceSelection(firstChoice, secondChoice) {
    let exerciseAttemptsLogCopy = [...exerciseAttemptsLog];
    let fullMessage = messageToNextNav;
    for (let i = 0; i < bookmarksToStudy.length; i++) {
      let currentBookmarkLog = exerciseAttemptsLogCopy[i];
      let concatMessage = "";
      if (currentBookmarkLog.bookmark.id === Number(firstChoice)) {
        if (firstChoice === secondChoice) {
          setButtonsToDisable((arr) => [...arr, firstChoice]);
          concatMessage = currentBookmarkLog.messageToAPI + "C";
          fullMessage = fullMessage + concatMessage;
          exerciseAttemptsLogCopy[i].messageToAPI = concatMessage;
          handleSpeak(exerciseAttemptsLogCopy[i].bookmark);
          setLastCorrectBookmarkId(currentBookmarkLog.bookmark.id);
          if (buttonsToDisable.length === 2) {
            setIsExerciseOver(true);
            exerciseAttemptsLogCopy[i].isLast = true;
            break;
          } else {
            notifyCorrectAnswer(currentBookmarkLog.bookmark, false);
            notifyExerciseCompleted(
              concatMessage,
              currentBookmarkLog.bookmark,
              false,
            );
          }
          setexerciseAttemptsLog(exerciseAttemptsLogCopy);
        } else {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmarkLog.bookmark);
          concatMessage = currentBookmarkLog.messageToAPI + "W";
          fullMessage = fullMessage + concatMessage;
          exerciseAttemptsLogCopy[i].messageToAPI = concatMessage;
          setexerciseAttemptsLog(exerciseAttemptsLogCopy);
        }
      } else if (currentBookmarkLog.bookmark.id === Number(secondChoice)) {
        if (firstChoice !== secondChoice) {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmarkLog.bookmark);
          concatMessage = currentBookmarkLog.messageToAPI + "W";
          fullMessage = fullMessage + concatMessage;
          exerciseAttemptsLogCopy[i].messageToAPI = concatMessage;
          setexerciseAttemptsLog(exerciseAttemptsLogCopy);
        }
      }
      if (selectedBookmark === currentBookmarkLog.bookmark)
        setSelectedBookmarkMessage(concatMessage);
    }
    setMessageToNextNav(fullMessage);
  }

  function setButtonOptions() {
    setFromButtonOptions(bookmarksToStudy);
    let optionsToShuffle = [
      bookmarksToStudy[0],
      bookmarksToStudy[1],
      bookmarksToStudy[2],
    ];
    let shuffledOptions = shuffle(optionsToShuffle);
    setToButtonOptions(shuffledOptions);
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.matchWordWithTranslation}{" "}
      </div>

      <BookmarkProgressBar
        bookmark={selectedBookmark}
        message={selectedBookmarkMessage}
        isGreyedOutBar={selectedBookmark === undefined}
      />

      <MatchInput
        fromButtonOptions={fromButtonOptions}
        toButtonOptions={toButtonOptions}
        notifyChoiceSelection={notifyChoiceSelection}
        inputFirstClick={inputFirstClick}
        buttonsToDisable={buttonsToDisable}
        isExerciseOver={isExerciseOver}
        api={api}
        incorrectAnswer={incorrectAnswer}
        setIncorrectAnswer={setIncorrectAnswer}
        reload={reload}
        setReload={setReload}
        onBookmarkSelected={setSelectedBookmark}
        notifyBookmarkDeletion={notifyBookmarkDeletion}
        isPronouncing={isPronouncing}
        lastCorrectBookmarkId={lastCorrectBookmarkId}
      />
    </s.Exercise>
  );
}
