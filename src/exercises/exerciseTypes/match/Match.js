import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import MatchInput from "./MatchInput.js";
import useBookmarkAutoPronounce from "../../../hooks/useBookmarkAutoPronounce.js";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression";
import { toast } from "react-toastify";

// The user has to match three L1 words to their correct L2 translations.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.match;

export default function Match({
  bookmarksToStudy,
  notifyIncorrectAnswer,
  notifyCorrectAnswer,
  setSelectedExerciseBookmark,
  setExerciseType,
  isExerciseOver,
  notifyExerciseCompleted,
  reload,
  setReload,
  resetSubSessionTimer,
  bookmarkProgressBar: BookmarkProgressBar,
  bookmarkProgressBarProps,
}) {
  const RIGHT = true;
  const LEFT = !RIGHT;

  const [autoPronounceBookmark] = useBookmarkAutoPronounce();
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [selectedRightBookmark, setSelectedRightBookmark] = useState(null);
  const [selectedLeftBookmark, setSelectedLeftBookmark] = useState(null);
  const [listOfSolvedBookmarks, setListOfSolvedBookmarks] = useState([]);
  const [wrongAnimationsDictionary, setWrongAnimationsDictionary] = useState({
    [RIGHT]: [],
    [LEFT]: [],
  });

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setSelectedExerciseBookmark();
    resetSubSessionTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isExerciseOver) setListOfSolvedBookmarks(bookmarksToStudy.map((bookmark) => bookmark.id));
  }, [isExerciseOver]);

  const speech = useContext(SpeechContext);

  async function handleSpeak(bookmark) {
    if (autoPronounceBookmark) {
      await speech.speakOut(bookmark.from, setIsPronouncing);
    }
  }

  function bookmarkIsDeleted(bookmark) {
    // TODO: strikethrough the bookmark
    let word_expression = "";
    if (isBookmarkExpression(bookmark)) word_expression = "expression";
    else word_expression = "word";
    toast.success(`The ${word_expression} '${bookmark.from}' is deleted!`);
  }

  useEffect(() => {
    let _isLeftStart = selectedLeftBookmark && !selectedRightBookmark;
    if (selectedLeftBookmark && selectedRightBookmark) {
      setSelectedExerciseBookmark(selectedLeftBookmark);
      // Handle check.
      setSelectedLeftBookmark();
      setSelectedRightBookmark();
      handleSpeak(selectedLeftBookmark);
      if (selectedLeftBookmark.id === selectedRightBookmark.id) {
        // Bookmarks are correct
        let _listOfSolvedBookmarks = [...listOfSolvedBookmarks, selectedLeftBookmark.id];

        setListOfSolvedBookmarks(_listOfSolvedBookmarks);
        if (_listOfSolvedBookmarks.length === bookmarksToStudy.length) notifyExerciseCompleted("", null, true);
        else {
          notifyCorrectAnswer(selectedLeftBookmark, false);
        }
      } else {
        let _newAnimationDictionary = {
          ...wrongAnimationsDictionary,
        };
        _newAnimationDictionary[LEFT] = [...wrongAnimationsDictionary[LEFT], selectedLeftBookmark.id];
        _newAnimationDictionary[RIGHT] = [...wrongAnimationsDictionary[RIGHT], selectedRightBookmark.id];
        setWrongAnimationsDictionary(_newAnimationDictionary);
        notifyIncorrectAnswer(selectedLeftBookmark);
      }
    }
    if (_isLeftStart) {
      setSelectedExerciseBookmark(selectedLeftBookmark);
    }
  }, [selectedRightBookmark, selectedLeftBookmark]);

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">{strings.matchWordWithTranslation} </div>

      <BookmarkProgressBar {...bookmarkProgressBarProps} />

      <MatchInput
        exerciseBookmarks={bookmarksToStudy}
        selectedLeftBookmark={selectedLeftBookmark}
        setSelectedLeftBookmark={setSelectedLeftBookmark}
        selectedRightBookmark={selectedRightBookmark}
        setSelectedRightBookmark={setSelectedRightBookmark}
        listOfSolvedBookmarks={listOfSolvedBookmarks}
        wrongAnimationsDictionary={wrongAnimationsDictionary}
        setWrongAnimationsDictionary={setWrongAnimationsDictionary}
        isExerciseOver={isExerciseOver}
        reload={reload}
        setReload={setReload}
        notifyBookmarkDeletion={bookmarkIsDeleted}
        isPronouncing={isPronouncing}
      />
    </s.Exercise>
  );
}
