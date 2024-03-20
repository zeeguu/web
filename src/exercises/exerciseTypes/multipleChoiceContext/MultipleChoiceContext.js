import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import shuffle from "../../../assorted/fisherYatesShuffle";

const EXERCISE_TYPE = "Select_L2T_fitting_L2W";
export default function MultipleChoiceContext({
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
  const [messageToAPI, setMessageToAPI] = useState("");
  const [exerciseBookmarks, setExerciseBookmarks] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);
  const [interactiveText, setInteractiveText] = useState(null);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [clickedOption, setClickedOption] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    let initExerciseBookmarks = [...bookmarksToStudy];
    for (let i = 0; i < initExerciseBookmarks.length; i++) {
      if (i === 0) initExerciseBookmarks[i].isExercise = true;
      else initExerciseBookmarks[i].isExercise = false;
    }
    setExerciseBookmarks(initExerciseBookmarks);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo.language,
          articleInfo.articleId,
          api,
          "TRANSLATE WORDS IN EXERCISE",
          EXERCISE_TYPE,
          speech,
        ),
      );
      setArticleInfo(articleInfo);
    });
  }, []);

  useEffect(() => {
    if (articleInfo && interactiveText) {
      setExerciseBookmarks(shuffle([...exerciseBookmarks]));
    }
  }, [articleInfo, interactiveText, bookmarksToStudy]);

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    handleAnswer(message);
    setShowSolution(true);
  }

  function notifyChoiceSelection(selectedChoice, index) {
    if (isCorrect) return;
    setClickedOption(index);
    if (selectedChoice === bookmarksToStudy[0].context) {
      setShowSolution(true);
      setClickedIndex(index);
      correctAnswer(bookmarksToStudy[0].context);
      setIsCorrect(true);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    } else {
      setClickedIndex(null);
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(bookmarksToStudy[0].context);
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

  if (!articleInfo || !interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="findWordInContext">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceContextHeadline}
      </div>
      <h1 className="wordInContextHeadline">{bookmarksToStudy[0].from}</h1>
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
          onClick={(e) => notifyChoiceSelection(option.context, index, e)}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: showSolution
                ? option.context.replace(
                    option.from,
                    getHighlightedWord(option.from),
                  )
                : option.context.replace(option.from, "_____"),
            }}
          />
        </s.MultipleChoiceContext>
      ))}

      <NextNavigation
        message={messageToAPI}
        api={api}
        bookmarksToStudy={bookmarksToStudy}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={(e) => handleShowSolution(e, undefined)}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
