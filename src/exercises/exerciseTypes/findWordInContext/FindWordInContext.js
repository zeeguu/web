import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";

import BottomInput from "./BottomInput";

import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";

const EXERCISE_TYPE = "Recognize_L1W_in_L2T";
export default function FindWordInContext({
  api,
  bookmarksToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
  toggleShow,
  toggleShowImproveTranslation,
}) {
  const [initialTime] = useState(new Date());
  const [firstTypeTime, setFirstTypeTime] = useState();
  const [messageToAPI, setMessageToAPI] = useState("");
  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(bookmarksToStudy[0].context, articleInfo, api)
      );
      setArticleInfo(articleInfo);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWords]);

  function colorWordInContext(context, word) {
    return context.replace(
      word,
      `<span class='highlightedWord'>${word}</span>`
    );
  }

  function checkTranslations() {
    let bookmarkWords = bookmarksToStudy[0].from.split(" ");
    bookmarkWords.forEach((word) => {
      if (translatedWords.includes(word)) {
        let concatMessage = messageToAPI + "T";
        setMessageToAPI(concatMessage);
        notifyIncorrectAnswer(bookmarksToStudy[0]);
      }
    });
  }

  function inputKeyPress() {
    if (firstTypeTime === undefined) {
      setFirstTypeTime(new Date());
    }
  }

  function handleShowSolution() {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    let duration = pressTime - initialTime;
    let concatMessage = messageToAPI + "S";

    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);

    api.uploadExerciseFeedback(
      concatMessage,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );
  }

  function handleCorrectAnswer() {
    console.log(new Date() - initialTime);
    console.log("^^^^ time elapsed");
    console.log(firstTypeTime - initialTime);
    console.log("^^^^ to first key press");
    let duration = firstTypeTime - initialTime;

    correctAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFeedback(
      messageToAPI,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setFirstTypeTime();
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      {bookmarksToStudy[0].to.includes(" ") ? (
        <div className="headline">
          {strings.findTheExpressionInContextHeadline}
        </div>
      ) : (
        <div className="headline">{strings.findTheWordInContextHeadline}</div>
      )}

      <h1>{bookmarksToStudy[0].to}</h1>
      {isCorrect ? (
        <div className="contextExample">
          <div
            dangerouslySetInnerHTML={{
              __html: colorWordInContext(
                bookmarksToStudy[0].context,
                bookmarksToStudy[0].from
              ),
            }}
          />
        </div>
      ) : (
        <TranslatableText
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
        />
      )}

      {!isCorrect && (
        <BottomInput
          handleCorrectAnswer={handleCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          bookmarksToStudy={bookmarksToStudy}
          notifyKeyPress={inputKeyPress}
          messageToAPI={messageToAPI}
          setMessageToAPI={setMessageToAPI}
        />
      )}
      {isCorrect && (
        <NextNavigation
          api={api}
          bookmarksToStudy={bookmarksToStudy}
          moveToNextExercise={moveToNextExercise}
        />
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        toggleShowImproveTranslation={toggleShowImproveTranslation}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
