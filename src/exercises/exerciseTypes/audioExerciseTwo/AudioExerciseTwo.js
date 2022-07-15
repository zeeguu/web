import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import removePunctuation from "../../../assorted/removePunctuation";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import AudioTwoBotInput from "./AudioTwoBotInput.js";
import EditButton from "../../../words/EditButton.js";

const EXERCISE_TYPE = "Select_AudioL2W_fitting_L2T";

export default function AudioExerciseTwo({
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
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [initialTime] = useState(new Date());
  const [messageToAPI, setMessageToAPI] = useState("");
  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [choiceOptions, setChoiceOptions] = useState(null);
  const [currentChoice, setCurrentChoice] = useState("");
  const [firstTypeTime, setFirstTypeTime] = useState();
  const [selectedButtonId, setSelectedButtonId] = useState("");
  const bookmarkToStudy = bookmarksToStudy[0];
  const exercise = "exercise";
  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(bookmarksToStudy[0].context, articleInfo, api)
      );
      setArticleInfo(articleInfo);
    });
    consolidateChoice();
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

  function inputKeyPress() {
    if (firstTypeTime === undefined) {
      setFirstTypeTime(new Date());
    }
  }

  // Setting current choice and id if the correct index is chosen
  function buttonSelectTrue(id) {
    if (currentChoice !== 0) {
      setCurrentChoice(true);
      setSelectedButtonId(id);
    }
    console.log(id + " true");
  }

  // Setting current choice and id if the incorrect index is chosen
  function buttonSelectFalse(id) {
    if (currentChoice !== 1 || currentChoice !== 2) {
      setCurrentChoice(false);
      setSelectedButtonId(id);
    }
    console.log(id + " false");
  }

  function handleShowSolution() {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    let duration = pressTime - initialTime;
    let message = messageToAPI + "S";

    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    handleAnswer(message, duration);
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setFirstTypeTime();
  }

  function handleAnswer(message) {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");

    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      pressTime - initialTime,
      bookmarksToStudy[0].id
    );
  }

  function consolidateChoice() {
    // Index 0 is the correct bookmark and index 1 and 2 are incorrect
    let listOfchoices = [0, 1, 2];
    let shuffledListOfChoices = shuffle(listOfchoices);
    setChoiceOptions(shuffledListOfChoices);
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

  const selectedButtonStyle = (id) => {
    if (selectedButtonId === id) {
      return "selected";
    }
    return null;
  };

  function handleClick(id) {
    setSelectedButtonId(id);
    console.log(id + " selected");
  }

  return (
    <s.Exercise>
      {!isCorrect && (
        <>
          <div className="headlineWithMoreSpace">
            {strings.audioExerciseTwoHeadline}
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
          <s.CenteredRow>
            {/* Mapping bookmarks to the buttons in random order, setting button properties based on bookmark index */}
            {choiceOptions ? (
              choiceOptions.map((option) =>
                0 !== option ? (
                  <SpeakButton
                    handleClick={() => buttonSelectFalse(option)}
                    onClick={(e) => handleClick(option)}
                    bookmarkToStudy={bookmarksToStudy[option]}
                    api={api}
                    id={option.id}
                    styling={selectedButtonStyle(option)}
                  />
                ) : (
                  <SpeakButton
                    handleClick={() => buttonSelectTrue(option)}
                    onClick={(e) => handleClick(option)}
                    bookmarkToStudy={bookmarksToStudy[option]}
                    api={api}
                    id={option.id}
                    styling={selectedButtonStyle(option)}
                  />
                )
              )
            ) : (
              <></>
            )}
          </s.CenteredRow>
        </>
      )}

      {!isCorrect && (
        <AudioTwoBotInput
          currentChoice={currentChoice}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
          setIncorrectAnswer={setIncorrectAnswer}
          handleShowSolution={handleShowSolution}
          toggleShow={toggleShow}
          handleCorrectAnswer={handleCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          messageToAPI={messageToAPI}
          setMessageToAPI={setMessageToAPI}
          notifyKeyPress={inputKeyPress}
        />
      )}
      {isCorrect && (
        <>
          <br></br>
          <h1 className="wordInContextHeadline">{bookmarksToStudy[0].to}</h1>
          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={bookmarksToStudy[0].from}
            />
          </div>
          <s.CenteredRow>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              style="next"
            />
            <br></br>
            <EditButton
              bookmark={bookmarksToStudy[0]}
              api={api}
              styling={exercise}
              reload={reload}
              setReload={setReload}
            />
            <NextNavigation
              api={api}
              bookmarksToStudy={bookmarksToStudy}
              moveToNextExercise={moveToNextExercise}
              reload={reload}
              setReload={setReload}
            />
          </s.CenteredRow>
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
