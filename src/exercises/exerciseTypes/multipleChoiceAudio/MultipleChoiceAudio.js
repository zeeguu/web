import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import shuffle from "../../../assorted/fisherYatesShuffle.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import MultipleChoiceAudioBottomInput from "./MultipleChoiceAudioBottomInput.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to select the correct spoken L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceAudio;

export default function MultipleChoiceAudio({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  resetSubSessionTimer,
  moveToNextExercise,
  reload,
  bookmarkProgressBar,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const [choiceOptions, setChoiceOptions] = useState(null);
  const [currentSelectedChoice, setCurrentSelectedChoice] = useState("");
  const exerciseBookmark = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Validate that context_tokenized exists and is properly formatted
    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    const newInteractiveText = new InteractiveText(
      exerciseBookmark.context_tokenized,
      exerciseBookmark.source_id,
      api,
      [],
      "TRANSLATE WORDS IN EXERCISE",
      exerciseBookmark.from_lang,
      EXERCISE_TYPE,
      speech,
      exerciseBookmark.context_identifier,
    );
    setInteractiveText(newInteractiveText);
    
    consolidateChoice();
    if (!SessionStorage.isAudioExercisesEnabled()) moveToNextExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, exerciseBookmark]);

  function consolidateChoice() {
    // Index 0 is the correct bookmark and index 1 and 2 are incorrect
    let listOfchoices = [0, 1, 2];
    let shuffledListOfChoices = shuffle(listOfchoices);
    setChoiceOptions(shuffledListOfChoices);
  }

  if (!interactiveText || !choiceOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      {/* Instructions - visible during exercise, invisible when showing solution but still take space */}
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceAudioHeadline}
      </div>

      {/* Context - always at the top, never moves */}
      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={() => {}}
        onInputChange={() => {}} // No input handling needed for multiple choice audio
        onInputSubmit={() => {}} // No input handling needed for multiple choice audio
        inputValue=""
        placeholder=""
        isCorrectAnswer={false}
        shouldFocus={false} // Don't focus any hidden input
        showHint={false} // Don't show "tap to type" hint
      />

      {/* Audio buttons - below context during exercise */}
      {!isExerciseOver && (
        <div style={{ marginTop: '2em' }}>
          <s.CenteredWordRow>
            {/* Mapping bookmarks to the buttons in random order, setting button properties based on bookmark index */}
            {choiceOptions &&
              choiceOptions.map((option) => (
                <SpeakButton
                  onClickCallback={(e) => {
                    setCurrentSelectedChoice(option);
                  }}
                  isSelected={option === currentSelectedChoice}
                  bookmarkToStudy={bookmarksToStudy[option]}
                  id={option}
                  styling={option === currentSelectedChoice ? "selected" : ""}
                />
              ))}
          </s.CenteredWordRow>
        </div>
      )}

      {/* Solution area - appears below context when exercise is over */}
      {isExerciseOver && (
        <div style={{ marginTop: '3em' }}>
          <h1 className="wordInContextHeadline">
            {removePunctuation(exerciseBookmark.to)}
          </h1>
          {bookmarkProgressBar}
        </div>
      )}

      {/* Bottom input - only during exercise */}
      {!isExerciseOver && (
        <MultipleChoiceAudioBottomInput
          bookmarksToStudy={bookmarksToStudy}
          currentChoice={currentSelectedChoice}
          targetBookmark={exerciseBookmark}
          notifyCorrectAnswer={notifyCorrectAnswer}
          notifyIncorrectAnswer={notifyIncorrectAnswer}
        />
      )}
    </s.Exercise>
  );
}
