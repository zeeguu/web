import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import useShadowRef from "../../../hooks/useShadowRef";
import { APIContext } from "../../../contexts/APIContext.js";

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceContext;

export default function MultipleChoiceContext({
  bookmarksToStudy,
  notifyCorrectAnswer,
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
  const api = useContext(APIContext);
  const [messageToAPI, setMessageToAPI] = useState("");
  const [exerciseBookmarks, setExerciseBookmarks] = useState(null);
  const [interactiveText, setInteractiveText] = useState(null);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const exerciseBookmark = { ...bookmarksToStudy[0], isExercise: true };
  const [clickedIndex, setClickedIndex] = useState(null);
  const [clickedOption, setClickedOption] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [wordInContextHeadline, setWordInContextHeadline] = useState(
    removePunctuation(exerciseBookmark.from),
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);
  const showSolutionRef = useShadowRef(showSolution);

  useEffect(() => {
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
    console.log(bookmarksToStudy);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.article_id,
        exerciseBookmark.context_in_content,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_type,
        null,
        exerciseBookmark.fragment_id,
      ),
    );
    // eslint-disable-next-line
  }, [isBookmarkChanged, bookmarksToStudy]);

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    handleAnswer(message);
    setShowSolution(true);
    setWordInContextHeadline(removePunctuation(exerciseBookmark.to));
  }

  function notifyChoiceSelection(
    selectedChoiceId,
    selectedChoiceContext,
    index,
    e,
  ) {
    if (isCorrect) return;
    setClickedOption(index);
    if (selectedChoiceId === exerciseBookmark.id) {
      setShowSolution(true);
      setClickedIndex(index);
      notifyCorrectAnswer(exerciseBookmark);
      setIsCorrect(true);
      setWordInContextHeadline(removePunctuation(exerciseBookmark.to));
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    } else {
      setClickedIndex(null);
      notifyIncorrectAnswer(exerciseBookmark);
      let concatMessage = messageToAPI + "W";
      setMessageToAPI(concatMessage);
      setTimeout(() => {
        // This line is here to avoid the reseting the styling on the
        // correct box if the user clicks on it shortly after getting the
        // context wrong.
        if (!showSolutionRef.current) setClickedOption(null);
      }, 500);
    }
  }

  function handleAnswer(message) {
    setMessageToAPI(message);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exerciseBookmark.id,
      exerciseSessionId,
    );
  }

  function getHighlightedWord(word) {
    return `<span class="highlightedWord">${word}</span>`;
  }

  if (!interactiveText || !exerciseBookmarks) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="findWordInContext">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceContextHeadline}
      </div>
      <BookmarkProgressBar bookmark={exerciseBookmark} message={messageToAPI} />
      <h1 className="wordInContextHeadline">{wordInContextHeadline}</h1>
      {exerciseBookmarks.map((option, index) => (
        <s.MultipleChoiceContext
          key={index}
          clicked={index === clickedIndex}
          isCorrect={isCorrect}
          className={
            clickedOption !== null
              ? index === clickedOption
                ? option.isExercise
                  ? "correct"
                  : "wrong"
                : ""
              : ""
          }
          onClick={(e) =>
            notifyChoiceSelection(option.id, option.context, index, e)
          }
        >
          {option.left_ellipsis && <>...</>}
          <span
            dangerouslySetInnerHTML={{
              __html: showSolution
                ? option.isExercise
                  ? option.context.replace(
                      option.from,
                      getHighlightedWord(option.from),
                    )
                  : option.context.replace(option.from, `<b>${option.from}</b>`)
                : option.context.replace(option.from, "_____"),
            }}
          />
          {option.right_ellipsis && <>...</>}
        </s.MultipleChoiceContext>
      ))}

      <NextNavigation
        exerciseType={EXERCISE_TYPE}
        message={messageToAPI}
        exerciseBookmark={bookmarksToStudy[0]}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={(e) => handleShowSolution(e, undefined)}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
        isBookmarkChanged={() => setIsBookmarkChanged(!isBookmarkChanged)}
      />
    </s.Exercise>
  );
}
