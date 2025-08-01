import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to select the correct L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoice;

export default function MultipleChoice({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  reload,
  isExerciseOver,
  setIsCorrect,
  resetSubSessionTimer,
  bookmarkProgressBar,
}) {
  const api = useContext(APIContext);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] MultipleChoice useEffect triggered`);
    console.log("MultipleChoice useEffect - exerciseBookmark:", exerciseBookmark);
    console.log("MultipleChoice useEffect - context_tokenized:", exerciseBookmark.context_tokenized);
    console.log("MultipleChoice useEffect - bookmark ID:", exerciseBookmark.id);
    console.log("MultipleChoice useEffect - reload state:", reload);
    console.log("MultipleChoice useEffect - word:", exerciseBookmark.from);
    
    api.wordsSimilarTo(exerciseBookmark.id, (words) => {
      console.log(`[${timestamp}] MultipleChoice - received similar words:`, words);
      consolidateChoiceOptions(words);
    });
    
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
    
    console.log(`[${timestamp}] MultipleChoice - created InteractiveText:`, newInteractiveText);
    console.log(`[${timestamp}] MultipleChoice - InteractiveText paragraphs:`, newInteractiveText.paragraphs);
    setInteractiveText(newInteractiveText);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.from.toLowerCase())) {
      setIsCorrect(true);
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
      setIsCorrect(false);
    }
  }

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      removePunctuation(exerciseBookmark.from.toLowerCase()),
      removePunctuation(similarWords[firstRandomInt].toLowerCase()),
      removePunctuation(similarWords[secondRandomInt].toLowerCase()),
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);
    setButtonOptions(shuffledListOfOptions);
  }

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      {/* Instructions - visible during exercise, invisible when showing solution but still take space */}
      <div className="headlineWithMoreSpace">
        {strings.chooseTheWordFittingContextHeadline}
      </div>

      {/* Context - always at the top, never moves */}
      <div className="contextExample">
        <TranslatableText
          isExerciseOver={isExerciseOver}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={exerciseBookmark.from}
          exerciseType={EXERCISE_TYPE}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
        />
      </div>

      {/* Solution area - appears below context when exercise is over */}
      {isExerciseOver && (
        <div style={{ marginTop: '3em' }}>
          <h1 className="wordInContextHeadline">
            {removePunctuation(exerciseBookmark.to)}
          </h1>
          {bookmarkProgressBar}
        </div>
      )}

      {/* Multiple choice buttons - only during exercise */}
      {!buttonOptions && <LoadingAnimation />}
      {!isExerciseOver && (
        <MultipleChoicesInput
          buttonOptions={buttonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
          setIncorrectAnswer={setIncorrectAnswer}
        />
      )}
    </s.Exercise>
  );
}
