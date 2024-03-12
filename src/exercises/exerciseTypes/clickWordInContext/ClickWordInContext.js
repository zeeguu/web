import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";

import BottomInput from "../findWordInContext/BottomInput.js";

import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { tokenize } from "../../../utils/preprocessing/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";

const EXERCISE_TYPE = "Click_L1W_in_L2T";
export default function ClickWordInContext({
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
  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (solutionDiscovered) {
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
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    correctAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function handleIncorrectAnswer() {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(bookmarksToStudy[0]);
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="findWordInContext">
      <div className="headlineWithMoreSpace">
        {strings.clickWordInContextHeadline}
      </div>
      <h1 className="wordInContextHeadline">{bookmarksToStudy[0].to}</h1>
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
