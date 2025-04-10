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
import { APIContext } from "../../../contexts/APIContext.js";

//shared code for ClickWordInContext and FindWordInContext exercises
//The difference between the two is that in FindWordInContext the user can choose to either click on the word or type the word.

export default function WordInContextExercise({
  exerciseType,
  exerciseHeadline,
  showBottomInput,
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
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);
  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    setExerciseType(exerciseType);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        exerciseType,
        speech,
        exerciseBookmark.context_identifier,
      ),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBookmarkChanged]);

  useEffect(() => {
    checkTranslations(translatedWords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWords]);

  function equalAfterRemovingSpecialCharacters(word1, word2) {
    // from: https://stackoverflow.com/a/4328546
    // TR (28-03-2025) We need to support cases where the word might be word1: childrens', word2:childrens
    // This now happens since the tokenizer doesn't reflect what is being done at the server.
    const removeSpecialChars = /[^\w\s']|_/g;

    let first = word1.replace(removeSpecialChars, "").replace(/\s+/g, " ");
    if (first[first.length - 1] === "'") first = first.slice(0, -1);
    let second = word2.replace(removeSpecialChars, "").replace(/\s+/g, " ");
    return first === second;
  }

  function checkTranslations(userTranslatedSequences) {
    if (userTranslatedSequences.length === 0) {
      return;
    }

    let solutionDiscovered = false;
    let solutionSplitIntoWords = tokenize(exerciseBookmark.from);

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
    notifyIncorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    console.log(activeSessionDuration);
    api.uploadExerciseFinalizedData(
      concatMessage,
      exerciseType,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exerciseBookmark.id,
      exerciseSessionId,
    );
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    notifyCorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      exerciseType,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exerciseBookmark.id,
      exerciseSessionId,
    );
  }

  function handleIncorrectAnswer() {
    //alert("incorrect answer")
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(exerciseBookmark);
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className={exerciseType}>
      <div className="headlineWithMoreSpace">{exerciseHeadline}</div>
      <BookmarkProgressBar bookmark={exerciseBookmark} message={messageToAPI} />
      <h1 className="wordInContextHeadline">
        {removePunctuation(exerciseBookmark.to)}
      </h1>
      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          bookmarkToStudy={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
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
        exerciseBookmark={exerciseBookmark}
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
