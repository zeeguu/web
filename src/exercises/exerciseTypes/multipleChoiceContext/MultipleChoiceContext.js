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
  const [articleInfo, setArticleInfo] = useState(null);
  const [interactiveText, setInteractiveText] = useState(null);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [contextOptions, setContextOptions] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [foundBookmarks, setFoundBookmarks] = useState([]);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
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
    setArticleInfo(articleInfo);
    });
  }, []);

  useEffect(() => {
    if (articleInfo && interactiveText) {
      setContextOptions(shuffle([
        bookmarksToStudy[0].context,
        bookmarksToStudy[1].context,
        bookmarksToStudy[2].context,
      ]));
    }
    setFoundBookmarks(findBookmarksInContext(bookmarksToStudy[0].context, bookmarksToStudy));
    console.log(foundBookmarks);
  }, [articleInfo, interactiveText, bookmarksToStudy]);

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    handleAnswer(message);
  }

 function notifyChoiceSelection(selectedChoice, index) {
    if (
        selectedChoice === bookmarksToStudy[0].context
    ) {
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

  if (!articleInfo || !interactiveText) {
    return <LoadingAnimation />;
  }

  function findBookmarksInContext(context, bookmarks) {
    const lowerCaseContext = context.toLowerCase();
    const foundBookmarks = [];

    bookmarks.forEach(bookmark => {
      const lowerCaseFrom = bookmark.from.toLowerCase();
      const index = lowerCaseContext.indexOf(lowerCaseFrom);
      if (index !== -1) {
        foundBookmarks.push({
          from: bookmark.from,
          index: index
        });
      }
    });
    return foundBookmarks;
  }

  return (
    <s.Exercise className="findWordInContext">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceContextHeadline}
      </div>
      <h1 className="wordInContextHeadline">{bookmarksToStudy[0].from}</h1>
        {contextOptions.map((option, index) => (
            <s.MultipleChoiceContext 
                key={index} 
                clicked={index === clickedIndex}
                isCorrect={isCorrect}
                className={(isCorrect && index === clickedIndex) ? "correct" : ""}
                onClick={() => notifyChoiceSelection(option, index)}>
                <div>
                    {option.replace(new RegExp(foundBookmarks.map(bookmark => bookmark.from).join('|'), 'g'), '_____')}
                </div>
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
