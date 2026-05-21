import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveExerciseText from "../../../reader/InteractiveExerciseText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";

// The user has to select the correct L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoice;

function buildInteractiveText(bookmark, api, speech) {
  const expectedPosition = {
    sentenceIndex: bookmark.t_sentence_i,
    tokenIndex: bookmark.t_token_i,
    totalTokens: bookmark.t_total_token || 1,
    contextOffset: bookmark.context_sent || 0,
  };
  const adapted = adaptExerciseBookmark(bookmark);
  return new InteractiveExerciseText(
    bookmark.context_tokenized,
    bookmark.source_id,
    api,
    adapted ? [adapted] : [],
    "TRANSLATE WORDS IN EXERCISE",
    bookmark.from_lang,
    EXERCISE_TYPE,
    speech,
    bookmark.context_identifier,
    null, // formatting
    bookmark.from, // expectedSolution
    expectedPosition,
    null, // onSolutionFound — not needed for multiple choice
  );
}

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
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [interactiveText, setInteractiveText] = useState();
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);

    // Fetch similar words only once on mount — don't re-fetch on context
    // change to avoid giving away the answer.
    api.wordsSimilarTo(exerciseBookmark.id, (words) => {
      consolidateChoiceOptions(words);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }
    setInteractiveText(buildInteractiveText(exerciseBookmark, api, speech));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

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
      <ExerciseInstructionHeader
        headline={strings.chooseTheWordFittingContextHeadline}
        isExerciseOver={isExerciseOver}
      />

      {/* Context - always at the top, never moves */}
      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={(data) => {
          onExampleUpdated(data);
          setInteractiveText(buildInteractiveText(data.updatedBookmark, api, speech));
        }}
        onInputChange={() => {}}
        onInputSubmit={() => {}}
        inputValue={isExerciseOver ? exerciseBookmark.from : ""}
        placeholder=""
        isCorrectAnswer={isExerciseOver}
        shouldFocus={false}
        showHint={false}
        canTypeInline={false}
      />

      {/* Solution area - L1 translation now surfaces as a chip above
          the highlighted bookmark word in the sentence via bookmark-
          restoration, so the big headline is redundant. */}
      {isExerciseOver && bookmarkProgressBar && (
        <div style={{ marginTop: '3em' }}>
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
