import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import NextNavigation from "../NextNavigation.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { tokenize } from "../../../utils/text/preprocessing.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";

//shared code for ClickWordInContext and FindWordInContext exercises
//The difference between the two is that in FindWordInContext the user can choose to either click on the word or type the word.

export default function WordInContextExercise({
  exerciseType,
  exerciseHeadline,
  showBottomInput,
  checkTranslations,
  handleShowSolution,
  handleCorrectAnswer,
  handleIncorrectAnswer,
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
  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);

  useEffect(() => {
    setExerciseType(exerciseType);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo,
          api,
          "TRANSLATE WORDS IN EXERCISE",
          exerciseType,
          speech,
        ),
      );
      setArticleInfo(articleInfo);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBookmarkChanged]);

  useEffect(() => {
    checkTranslations(translatedWords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWords]);

  function equalAfterRemovingSpecialCharacters(a, b) {
    // from: https://stackoverflow.com/a/4328546
    let first = a.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");
    let second = b.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");
    return first === second;
  }

  function checkTranslations(userTranslatedSequences) {
    if (userTranslatedSequences.length === 0) {
      return;
    }

    let solutionDiscovered = false;

    let solutionSplitIntoWords = tokenize(bookmarksToStudy[0].from);

    solutionSplitIntoWords.forEach((wordInSolution) => {
      userTranslatedSequences.forEach((userTranslatedSequence) => {
        let wordsInUserTranslatedSequence = userTranslatedSequence.split(" ");
        wordsInUserTranslatedSequence.forEach((translatedWord) => {
          if (
            equalAfterRemovingSpecialCharacters(translatedWord, wordInSolution)
          ) {
            solutionDiscovered = true;
          }
        });
      });
    });

    if (solutionDiscovered && !isCorrect) {
      // Check how many translations were made
      let translationCount = 0;
      for (let i = 0; i < messageToAPI.length; i++) {
        if (messageToAPI[i] === "T") translationCount++;
      }
      if (translationCount < 2) {
        let concatMessage = messageToAPI + "C";
        handleCorrectAnswer(concatMessage);
      } else {
        let concatMessage = messageToAPI + "S";
        handleShowSolution(undefined, concatMessage);
      }
    } else {
      setMessageToAPI(messageToAPI + "T");
    }
  }

  function handleShowSolution(e, message) {
    if (e) {
      e.preventDefault();
    }
    let concatMessage;

    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }
    setMessageToAPI(concatMessage);
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    console.log(activeSessionDuration);
    api.uploadExerciseFinalizedData(
      concatMessage,
      exerciseType,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    notifyCorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      exerciseType,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function handleIncorrectAnswer() {
    //alert("incorrect answer")
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(bookmarksToStudy[0]);
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className={exerciseType}>
      <div className="headlineWithMoreSpace">{exerciseHeadline}</div>
      <BookmarkProgressBar
        bookmark={bookmarksToStudy[0]}
        message={messageToAPI}
      />
      <h1 className="wordInContextHeadline">
        {removePunctuation(bookmarksToStudy[0].to)}
      </h1>
      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          bookmarkToStudy={bookmarksToStudy[0].from}
        />
      </div>
      {showBottomInput && !isCorrect && (
        <BottomInput
          handleCorrectAnswer={handleCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          bookmarksToStudy={bookmarksToStudy}
          messageToAPI={messageToAPI}
          setMessageToAPI={setMessageToAPI}
        />
      )}
      <NextNavigation
        exerciseType={exerciseType}
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
