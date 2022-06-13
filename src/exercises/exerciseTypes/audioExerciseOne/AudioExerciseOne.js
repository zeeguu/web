import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../findWordInContext/BottomInput.js";
import SpeakButton from "../SpeakButton";
import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks";
import ZeeguuSpeech from "../../../speech/ZeeguuSpeech.js";
import * as w from "../../../words/Word.sc";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";

const EXERCISE_TYPE = "TypeL2W_in_AudioL2";
export default function AudioExerciseOne({
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
}) {
  const [initialTime] = useState(new Date());
  const [firstTypeTime, setFirstTypeTime] = useState();
  const [messageToAPI, setMessageToAPI] = useState("");
  const bookmarkToStudy = bookmarksToStudy[0];
  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));
  const [interactiveText, setInteractiveText] = useState();
  const [articleInfo, setArticleInfo] = useState();

  async function handleSpeak() {
    await speech.speakOut(bookmarkToStudy.from);
  }

  // Timeout is set so that the page renders before the word is spoken, allowing for the user to gain focus on the page
  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setTimeout(() => {
      handleSpeak();
    }, 500);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(bookmarksToStudy[0].context, articleInfo, api)
      );
      setArticleInfo(articleInfo);
    });
  }, []);


  function inputKeyPress() {
    if (firstTypeTime === undefined) {
      setFirstTypeTime(new Date());
    }
  }

  if (!articleInfo) {
    return <LoadingAnimation />;
  }

  function handleShowSolution(e, message) {
    e.preventDefault();
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    let duration = pressTime - initialTime;
    let concatMessage = "";
    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }

    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFeedback(
      concatMessage,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );
  }

  function handleCorrectAnswer(message) {
    console.log(new Date() - initialTime);
    console.log(firstTypeTime - initialTime);
    let duration = firstTypeTime - initialTime;

    correctAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setFirstTypeTime();
  }

  return (
    <s.Exercise>
      <div className="headline">{strings.audioExerciseHeadline}</div>
      {!isCorrect && (
        <>
          <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={bookmarksToStudy[0].from}
        />
        </div>
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              styling="large"
            />
          </s.CenteredRowTall>

          <BottomInput
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            bookmarksToStudy={bookmarksToStudy}
            notifyKeyPress={inputKeyPress}
            messageToAPI={messageToAPI}
            setMessageToAPI={setMessageToAPI}
          />
        </>
      )}
      {isCorrect && (
        <>
          <br></br>
          <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={bookmarksToStudy[0].from}
        />
        </div>
            <w.WordPairAudioExerciseOne>
              <div className="to">
                {`${bookmarksToStudy[0].to}`}
              </div>
            </w.WordPairAudioExerciseOne>
          <NextNavigation
            api={api}
            bookmarksToStudy={bookmarksToStudy}
            moveToNextExercise={moveToNextExercise}
            reload={reload}
            setReload={setReload}
          />
        </>
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
