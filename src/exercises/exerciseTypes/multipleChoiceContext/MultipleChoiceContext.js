import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";

import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { tokenize } from "../../../utils/preprocessing/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/preprocessing/preprocessing";

const EXERCISE_TYPE = "Select_L2T_fitting_L1W";
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
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [contextOptions, setContextOptions] = useState([]);

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
    // generateContextOptions(bookmarksToStudy[0].context);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (articleInfo && interactiveText) {
      setContextOptions(shuffle([
        bookmarksToStudy[0].context,
        bookmarksToStudy[1].context,
        bookmarksToStudy[2].context,
      ]));
      console.log(contextOptions);
    }
  }, [articleInfo, interactiveText, bookmarksToStudy]);

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

  function handleAnswer(selectedChoice) {
    if (selectedChoice === bookmarksToStudy[0].context) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
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

  function handleIncorrectAnswer(message) {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(bookmarksToStudy[0]);
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
      <div className="contextExample">
        {/* <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          bookmarkToStudy={bookmarksToStudy[0].from}
          exerciseType={EXERCISE_TYPE}
          wordOptions={contextOptions}
        /> */}
        {contextOptions.map((option, index) => (
            <div key={index} onClick={() => handleAnswer(option)} className="contextOption">
                {option}
            </div>
        ))}
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
