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

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceContext;

export default function MultipleChoiceContext({
  api,
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
  const [messageToAPI, setMessageToAPI] = useState("");
  const [exerciseBookmarks, setExerciseBookmarks] = useState(null);
  const [interactiveText, setInteractiveText] = useState(null);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [clickedOption, setClickedOption] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [wordInContextHeadline, setWordInContextHeadline] = useState(
    removePunctuation(bookmarksToStudy[0].from),
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    let initExerciseBookmarks = [...bookmarksToStudy];
    for (let i = 0; i < initExerciseBookmarks.length; i++) {
      if (i === 0) initExerciseBookmarks[i].isExercise = true;
      else initExerciseBookmarks[i].isExercise = false;
    }
    setExerciseBookmarks(shuffle(initExerciseBookmarks));

    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo,
          api,
          "TRANSLATE WORDS IN EXERCISE",
          EXERCISE_TYPE,
          speech,
        ),
      );
    });
  }, []);

  useEffect(() => {
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo,
          api,
          "TRANSLATE WORDS IN EXERCISE",
          EXERCISE_TYPE,
          speech,
        ),
      );
    });
  }, [isBookmarkChanged]);

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    handleAnswer(message);
    setShowSolution(true);
    setWordInContextHeadline(removePunctuation(bookmarksToStudy[0].to));
  }

  function notifyChoiceSelection(
    selectedChoiceId,
    selectedChoiceContext,
    index,
    e,
  ) {
    if (isCorrect) return;
    setClickedOption(index);
    if (selectedChoiceId === bookmarksToStudy[0].id) {
      setShowSolution(true);
      setClickedIndex(index);
      notifyCorrectAnswer(bookmarksToStudy[0]);
      setIsCorrect(true);
      setWordInContextHeadline(removePunctuation(bookmarksToStudy[0].to));
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    } else {
      setClickedIndex(null);
      setIncorrectAnswer(selectedChoiceId);
      notifyIncorrectAnswer(bookmarksToStudy[0]);
      let concatMessage = messageToAPI + "W";
      setMessageToAPI(concatMessage);
      setTimeout(() => {
        setClickedOption(null);
      }, 500);
    }
  }

  function handleAnswer(message) {
    setMessageToAPI(message);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function getHighlightedWord(word) {
    return `<span class="highlightedWord">${word}</span>`;
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="findWordInContext">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceContextHeadline}
      </div>
      <BookmarkProgressBar
        bookmark={bookmarksToStudy[0]}
        message={messageToAPI}
      />
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
          <div
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
        </s.MultipleChoiceContext>
      ))}

      <NextNavigation
        exerciseType={EXERCISE_TYPE}
        message={messageToAPI}
        api={api}
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
