import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import useShadowRef from "../../../hooks/useShadowRef";
import { APIContext } from "../../../contexts/APIContext.js";
import { highlightWord, replaceWordWithPlaceholder } from "../../../utils/text/highlightWord";

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceContext;

export default function MultipleChoiceContext({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  reload,
  resetSubSessionTimer,
  bookmarkProgressBar,
}) {
  const api = useContext(APIContext);
  const [exerciseBookmarks, setExerciseBookmarks] = useState(null);
  const [interactiveText, setInteractiveText] = useState(null);
  const speech = useContext(SpeechContext);
  const [exerciseBookmark, setExerciseBookmark] = useState({ ...bookmarksToStudy[0], isExercise: true });
  const [clickedIndex, setClickedIndex] = useState(null);
  const [clickedOption, setClickedOption] = useState(null);
  const [wordInContextHeadline, setWordInContextHeadline] = useState(removePunctuation(bookmarksToStudy[0].from));
  const isExerciseOverRef = useShadowRef(isExerciseOver);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    let initExerciseBookmarks = [...bookmarksToStudy];
    for (let i = 0; i < initExerciseBookmarks.length; i++) {
      if (i === 0) initExerciseBookmarks[i].isExercise = true;
      else initExerciseBookmarks[i].isExercise = false;
    }
    setExerciseBookmarks(shuffle(initExerciseBookmarks));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Update exerciseBookmark when bookmarksToStudy changes
    const newExerciseBookmark = { ...bookmarksToStudy[0], isExercise: true };
    setExerciseBookmark(newExerciseBookmark);
    
    // Validate that context_tokenized exists and is properly formatted
    if (!newExerciseBookmark.context_tokenized || !Array.isArray(newExerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    setInteractiveText(
      new InteractiveText(
        newExerciseBookmark.context_tokenized,
        newExerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        newExerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        newExerciseBookmark.context_identifier,
      ),
    );
    // eslint-disable-next-line
  }, [reload, bookmarksToStudy]);

  function notifyChoiceSelection(selectedChoiceId, selectedChoiceContext, index, e) {
    if (isExerciseOver) return;
    setClickedOption(index);
    if (selectedChoiceId === exerciseBookmark.id) {
      setClickedIndex(index);
      setWordInContextHeadline(removePunctuation(exerciseBookmark.to));
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setClickedIndex(null);
      notifyIncorrectAnswer(exerciseBookmark);
      setTimeout(() => {
        // This line is here to avoid the reseting the styling on the
        // correct box if the user clicks on it shortly after getting the
        // context wrong.
        if (!isExerciseOverRef.current) setClickedOption(null);
      }, 500);
    }
  }

  // Get the text to display for an option
  // When exercise is over: highlight the word
  // During exercise: replace with blank
  function getOptionDisplayText(option) {
    if (isExerciseOver) {
      return highlightWord(option.context, option.from);
    } else {
      return replaceWordWithPlaceholder(option.context, option.from, "_____");
    }
  }

  if (!interactiveText || !exerciseBookmarks) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="findWordInContext">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceContextHeadline}
      </div>

      <h1 className="wordInContextHeadline">{wordInContextHeadline}</h1>
      <div style={{ visibility: isExerciseOver ? 'visible' : 'hidden' }}>
        {bookmarkProgressBar}
      </div>
      {exerciseBookmarks
        .filter((option) => !isExerciseOver || option.isExercise)
        .map((option, index) => (
          <s.MultipleChoiceContext
            key={index}
            clicked={index === clickedIndex}
            className={
              clickedOption !== null ? (index === clickedOption ? (option.isExercise ? "correct" : "wrong") : "") : ""
            }
            onClick={(e) => notifyChoiceSelection(option.id, option.context, index, e)}
          >
            {option.left_ellipsis && <>...</>}
            <span
              dangerouslySetInnerHTML={{
                __html: getOptionDisplayText(option),
              }}
            />
            {option.right_ellipsis && <>...</>}
          </s.MultipleChoiceContext>
        ))}
    </s.Exercise>
  );
}
