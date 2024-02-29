import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";

import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/preprocessing/preprocessing";
import { SpeechContext } from "../../SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";

const EXERCISE_TYPE = "Select_L2W_fitting_L2T";

export default function MultipleChoice({
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
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [initialTime] = useState(new Date());
  const [buttonOptions, setButtonOptions] = useState(null);
  const [messageToAPI, setMessageToAPI] = useState("");
  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.wordsSimilarTo(bookmarksToStudy[0].id, (words) => {
      consolidateChoiceOptions(words);
    });
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

  function notifyChoiceSelection(selectedChoice) {
    console.log("checking result...");
    if (
      selectedChoice ===
      removePunctuation(bookmarksToStudy[0].from.toLowerCase())
    ) {
      correctAnswer(bookmarksToStudy[0]);
      setIsCorrect(true);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(bookmarksToStudy[0]);
      let concatMessage = messageToAPI + "W";
      setMessageToAPI(concatMessage);
    }
  }

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.wordsSimilarTo(bookmarksToStudy[0].id, (words) => {
      consolidateChoiceOptions(words);
    });
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo,
          api,
          "TRANSLATE WORDS IN EXERCISE",
        ),
      );
      setArticleInfo(articleInfo);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    handleAnswer(message);
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

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      removePunctuation(bookmarksToStudy[0].from.toLowerCase()),
      removePunctuation(similarWords[firstRandomInt].toLowerCase()),
      removePunctuation(similarWords[secondRandomInt].toLowerCase()),
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);
    setButtonOptions(shuffledListOfOptions);
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <div className="headlineWithMoreSpace">
        {strings.chooseTheWordFittingContextHeadline}
      </div>
      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={bookmarksToStudy[0].from}
        />
      </div>

      {isCorrect && <h1>{bookmarksToStudy[0].to}</h1>}

      {!buttonOptions && <LoadingAnimation />}
      {!isCorrect && (
        <MultipleChoicesInput
          buttonOptions={buttonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
          setIncorrectAnswer={setIncorrectAnswer}
          handleShowSolution={handleShowSolution}
          toggleShow={toggleShow}
        />
      )}
      <NextNavigation
        message={messageToAPI}
        api={api}
        bookmarksToStudy={bookmarksToStudy}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
