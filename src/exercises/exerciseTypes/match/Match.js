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
    speech.stopAudio(); // Stop any pending speech from previous exercise
    setExerciseType(EXERCISE_TYPE);
    setSelectedExerciseBookmark();
    resetSubSessionTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isExerciseOver)
      setListOfSolvedBookmarks((prev) => {
        const remaining = bookmarksToStudy.map((b) => b.id).filter((id) => !prev.includes(id));
        return [...prev, ...remaining];
      });
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
    if (_isLeftStart) {
      setSelectedExerciseBookmark(selectedLeftBookmark);
    }

    if (selectedLeftBookmark && selectedRightBookmark) {
      setSelectedExerciseBookmark(selectedLeftBookmark);

      let userHasAnsweredCorrectly = selectedLeftBookmark.id === selectedRightBookmark.id;

      if (userHasAnsweredCorrectly) {
        // The user has answered correctly
        handleSpeak(selectedLeftBookmark);

        let _listOfSolvedBookmarks = [...listOfSolvedBookmarks, selectedLeftBookmark.id];

        setListOfSolvedBookmarks(_listOfSolvedBookmarks);

        if (_listOfSolvedBookmarks.length === bookmarksToStudy.length - 1) {
          // One pair left — auto-complete it after a short delay so the reveal
          // feels animated. The user has no real choice at this point so we don't
          // score it as a correct answer, but we still track the word (so it
          // shows in History) with a neutral outcome.
          notifyCorrectAnswer(selectedLeftBookmark, false);
          const lastBookmark = bookmarksToStudy.find((b) => !_listOfSolvedBookmarks.includes(b.id));
          setTimeout(() => {
            setListOfSolvedBookmarks([..._listOfSolvedBookmarks, lastBookmark.id]);
            notifyExerciseCompleted("", lastBookmark, true);
          }, 800);
        } else if (_listOfSolvedBookmarks.length === bookmarksToStudy.length) {
          // All pairs solved (only reachable if there was just 1 bookmark)
          notifyCorrectAnswer(selectedLeftBookmark, true);
        } else {
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

      // Unselect both - no matter if we're correct or wrong
      setSelectedLeftBookmark();
      setSelectedRightBookmark();
    }
  }, [selectedLeftBookmark, selectedRightBookmark]);

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.matchWordWithTranslation}
      </div>

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
