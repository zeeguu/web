import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import NextNavigation from "../NextNavigation.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import shuffle from "../../../assorted/fisherYatesShuffle.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import AudioTwoBotInput from "./MultipleChoiceAudioBottomInput.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import DisableAudioSession from "../DisableAudioSession.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to select the correct spoken L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceAudio;

export default function MultipleChoiceAudio({
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
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [messageToAPI, setMessageToAPI] = useState("");
  const [interactiveText, setInteractiveText] = useState();
  const [choiceOptions, setChoiceOptions] = useState(null);
  const [currentChoice, setCurrentChoice] = useState("");
  const [firstTypeTime, setFirstTypeTime] = useState();
  const [selectedButtonId, setSelectedButtonId] = useState("");
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const exerciseBookmark = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.article_id,
        exerciseBookmark.context_in_content,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_type,
        null,
        exerciseBookmark.fragment_id,
      ),
    );
    consolidateChoice();
    if (!SessionStorage.isAudioExercisesEnabled()) handleDisabledAudio();

    // eslint-disable-next-line
  }, [exerciseBookmark, isBookmarkChanged]);

  function notifyChoiceSelection(selectedChoice) {
    if (
      selectedChoice === removePunctuation(exerciseBookmark.from.toLowerCase())
    ) {
      notifyCorrectAnswer(exerciseBookmark);
      setIsCorrect(true);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
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
  }

  // Setting current choice and id if the incorrect index is chosen
  function buttonSelectFalse(id) {
    if (currentChoice !== 1 || currentChoice !== 2) {
      setCurrentChoice(false);
      setSelectedButtonId(id);
    }
  }

  function handleDisabledAudio() {
    api.logUserActivity(api.AUDIO_DISABLE, "", exerciseBookmark.id, "");
    moveToNextExercise();
  }

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    handleAnswer(message);
  }

  function handleIncorrectAnswer() {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(exerciseBookmark);
    setFirstTypeTime(new Date());
  }

  function handleAnswer(message) {
    setMessageToAPI(message);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exerciseBookmark.id,
      exerciseSessionId,
    );
  }

  function consolidateChoice() {
    // Index 0 is the correct bookmark and index 1 and 2 are incorrect
    let listOfchoices = [0, 1, 2];
    let shuffledListOfChoices = shuffle(listOfchoices);
    setChoiceOptions(shuffledListOfChoices);
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    notifyCorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exerciseBookmark.id,
      exerciseSessionId,
    );
  }

  if (!interactiveText || !choiceOptions) {
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
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceAudioHeadline}
      </div>
      <BookmarkProgressBar bookmark={exerciseBookmark} message={messageToAPI} />
      {isCorrect && (
        <>
          <br></br>
          <h1 className="wordInContextHeadline">
            {removePunctuation(exerciseBookmark.to)}
          </h1>
        </>
      )}

      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
        />
      </div>

      {!isCorrect && (
        <s.CenteredRow>
          {/* Mapping bookmarks to the buttons in random order, setting button properties based on bookmark index */}
          {choiceOptions ? (
            choiceOptions.map((option) =>
              0 !== option ? (
                <SpeakButton
                  handleClick={() => buttonSelectFalse(option)}
                  onClick={(e) => handleClick(option)}
                  bookmarkToStudy={bookmarksToStudy[option]}
                  id={option.id}
                  styling={selectedButtonStyle(option)}
                />
              ) : (
                <SpeakButton
                  handleClick={() => buttonSelectTrue(option)}
                  onClick={(e) => handleClick(option)}
                  bookmarkToStudy={bookmarksToStudy[option]}
                  id={option.id}
                  styling={selectedButtonStyle(option)}
                />
              ),
            )
          ) : (
            <></>
          )}
        </s.CenteredRow>
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

      <NextNavigation
        exerciseType={EXERCISE_TYPE}
        message={messageToAPI}
        exerciseBookmark={exerciseBookmark}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
        isBookmarkChanged={() => setIsBookmarkChanged(!isBookmarkChanged)}
      />
      {SessionStorage.isAudioExercisesEnabled() && (
        <DisableAudioSession
          handleDisabledAudio={handleDisabledAudio}
          setIsCorrect={setIsCorrect}
        />
      )}
    </s.Exercise>
  );
}
