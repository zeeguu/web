import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import MatchInput from "./MatchInput.js";
import { toast } from "react-toastify";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression.js";
import useBookmarkAutoPronounce from "../../../hooks/useBookmarkAutoPronounce.js";
import { APIContext } from "../../../contexts/APIContext.js";
import { CORRECT } from "../../ExerciseConstants.js";

// The user has to match three L1 words to their correct L2 translations.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.match;

export default function Match({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  notifyExerciseCompleted,
  exerciseMessageToAPI,
  selectedExerciseBookmark,
  setSelectedExerciseBookmark,
  setIsExerciseOver,
  reload,
  setReload,
  resetSubSessionTimer,
}) {
  const RIGHT = true;
  const LEFT = !RIGHT;
  const api = useContext(APIContext);

  const [firstPressTime, setFirstPressTime] = useState();
  const [buttonsToDisable, setButtonsToDisable] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [autoPronounceBookmark] = useBookmarkAutoPronounce();
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [selectedRightBookmark, setSelectedRightBookmark] = useState(null);
  const [selectedLeftBookmark, setSelectedLeftBookmark] = useState(null);
  const [listOfSolvedBookmarks, setListOfSolvedBookmarks] = useState([]);
  const [wrongAnimationsDictionary, setWrongAnimationsDictionary] = useState({
    [RIGHT]: [],
    [LEFT]: [],
  });

  /*
    Dictionary has Left and Right animations
  */

  const [isLeftStart, setIsLeftStart] = useState();

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setButtonsToDisable([]);
    setSelectedExerciseBookmark();
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
    let _isLeftStart = selectedLeftBookmark && !selectedRightBookmark;
    let _isRightStart = !selectedLeftBookmark && selectedRightBookmark;
    if (selectedLeftBookmark && selectedRightBookmark) {
      // Handle check.
      setSelectedLeftBookmark();
      setSelectedRightBookmark();
      setIsLeftStart();
      handleSpeak(selectedLeftBookmark);
      if (selectedLeftBookmark.id === selectedRightBookmark.id) {
        // Bookmarks are correct
        let _listOfSolvedBookmarks = [
          ...listOfSolvedBookmarks,
          selectedLeftBookmark.id,
        ];

        setListOfSolvedBookmarks(_listOfSolvedBookmarks);
        if (_listOfSolvedBookmarks.length === bookmarksToStudy.length)
          notifyExerciseCompleted("", selectedLeftBookmark, true);
        else notifyExerciseCompleted(CORRECT, selectedLeftBookmark, false);
      } else {
        let _newAnimationDictionary = {
          ...wrongAnimationsDictionary,
        };
        _newAnimationDictionary[LEFT] = [
          ...wrongAnimationsDictionary[LEFT],
          selectedLeftBookmark.id,
        ];
        _newAnimationDictionary[RIGHT] = [
          ...wrongAnimationsDictionary[RIGHT],
          selectedRightBookmark.id,
        ];
        setWrongAnimationsDictionary(_newAnimationDictionary);
        notifyIncorrectAnswer(selectedLeftBookmark);
      }
    }
    if (_isLeftStart) {
      setIsLeftStart(true);
      setSelectedExerciseBookmark(selectedLeftBookmark);
    }
    if (_isRightStart) {
      setIsLeftStart(false);
    }
  }, [selectedRightBookmark, selectedLeftBookmark]);

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.matchWordWithTranslation}{" "}
      </div>

      <BookmarkProgressBar
        bookmark={selectedExerciseBookmark}
        message={exerciseMessageToAPI}
        isGreyedOutBar={selectedExerciseBookmark === undefined}
      />

      <MatchInput
        exerciseBookmarks={bookmarksToStudy}
        selectedLeftBookmark={selectedLeftBookmark}
        setSelectedLeftBookmark={setSelectedLeftBookmark}
        selectedRightBookmark={selectedRightBookmark}
        setSelectedRightBookmark={setSelectedRightBookmark}
        listOfSolvedBookmarks={listOfSolvedBookmarks}
        wrongAnimationsDictionary={wrongAnimationsDictionary}
        setWrongAnimationsDictionary={setWrongAnimationsDictionary}
        inputFirstClick={inputFirstClick}
        buttonsToDisable={buttonsToDisable}
        isExerciseOver={isExerciseOver}
        api={api}
        incorrectAnswer={incorrectAnswer}
        setIncorrectAnswer={setIncorrectAnswer}
        reload={reload}
        setReload={setReload}
        isPronouncing={isPronouncing}
      />
    </s.Exercise>
  );
}
