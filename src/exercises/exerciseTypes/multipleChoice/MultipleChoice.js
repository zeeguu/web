import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";

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
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType: EXERCISE_TYPE });

  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType: EXERCISE_TYPE,
    reload,
    onExerciseLoaded,
    expectedSolution: exerciseBookmark.from,
    expectedPosition: {
      sentenceIndex: exerciseBookmark.t_sentence_i,
      tokenIndex: exerciseBookmark.t_token_i,
      totalTokens: exerciseBookmark.t_total_token || 1,
      contextOffset: exerciseBookmark.context_sent || 0,
    },
  });

  useEffect(() => {
    // Fetch similar words only once on mount — don't re-fetch on context
    // change to avoid giving away the answer.
    api.wordsSimilarTo(exerciseBookmark.id, consolidateChoiceOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.from.toLowerCase())) {
      setIsCorrect(true);
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setIsCorrect(false);
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
    }
  }

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    const options = [
      removePunctuation(exerciseBookmark.from.toLowerCase()),
      removePunctuation(similarWords[firstRandomInt].toLowerCase()),
      removePunctuation(similarWords[secondRandomInt].toLowerCase()),
    ];
    setButtonOptions(shuffle(options));
  }

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <ExerciseInstructionHeader
        headline={strings.chooseTheWordFittingContextHeadline}
        isExerciseOver={isExerciseOver}
      />

      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        onInputChange={() => {}}
        onInputSubmit={() => {}}
        inputValue={isExerciseOver ? exerciseBookmark.from : ""}
        placeholder=""
        isCorrectAnswer={isExerciseOver}
        shouldFocus={false}
        showHint={false}
        canTypeInline={false}
      />

      {isExerciseOver && bookmarkProgressBar && (
        <div style={{ marginTop: "3em" }}>
          {bookmarkProgressBar}
        </div>
      )}

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
