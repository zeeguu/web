import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";

import BotInput from "./BotInput";
import SpeakButton from "../SpeakButton";
import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import ZeeguuSpeech from "../../../speech/ZeeguuSpeech.js";
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
  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  
  const bookmarkToStudy = bookmarksToStudy[0];
  const audio = "audio";
  const initialBookmarkState = [
    {
      bookmark: bookmarksToStudy[0],
      messageToAPI: "",
    },
  ];
  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));
  const [isSpeaking, setIsSpeaking] = useState(false);

   async function handleSpeak() {
    setIsSpeaking(true);
    await speech.speakOut(bookmarkToStudy.from);
    setIsSpeaking(false);
  };
  useEffect(() => {
    setTimeout(() => {handleSpeak()}, 1500)
    setExerciseType(EXERCISE_TYPE);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      
      setInteractiveText(
        new InteractiveText(bookmarksToStudy[0].context, articleInfo, api)
      );
      
       console.log(bookmarksToStudy[0].from);
      setArticleInfo(articleInfo);
      
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWords]);

  function checkTranslations() {
    let bookmarkWords = bookmarksToStudy[0].from.split(" ");
    bookmarkWords.forEach((word) => {
      translatedWords.forEach((translation) => {
        let splitTranslation = translation.split(" ");
        if (splitTranslation.length > 1) {
          splitTranslation.forEach((translatedWord) => {
            if (translatedWord === word) {
              notifyBookmarkTranslation();
            } 
          });
        } else {
          if (translation === word) {
            notifyBookmarkTranslation();
          }
        }
      });
    });
  }

  function notifyBookmarkTranslation() {
    let concatMessage = messageToAPI + "T";
    handleShowSolution(concatMessage);
  }

  function inputKeyPress() {
    if (firstTypeTime === undefined) {
      setFirstTypeTime(new Date());
    }
  }

  function handleShowSolution(e, message) {
    e.preventDefault()
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
  if (!articleInfo) {
    return <LoadingAnimation />;
  }
 
  return (
    <s.Exercise>
        <div className="headline">
          {strings.audioExerciseHeadline}
        </div>
     {!isCorrect && (
        <>
        <SpeakButton
            bookmarkToStudy={bookmarkToStudy}
            api={api}
            styling={audio}
        />
        <BotInput
          handleCorrectAnswer={handleCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          bookmarksToStudy={bookmarksToStudy}
          notifyKeyPress={inputKeyPress}
          messageToAPI={messageToAPI}
          setMessageToAPI={setMessageToAPI} />
            </>
      )}
      {isCorrect && (
        <NextNavigation
          api={api}
          bookmarksToStudy={bookmarksToStudy}
          moveToNextExercise={moveToNextExercise}
          reload={reload}
          setReload={setReload}
        />    
      )}
       <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
     
    </s.Exercise>
  );
}
