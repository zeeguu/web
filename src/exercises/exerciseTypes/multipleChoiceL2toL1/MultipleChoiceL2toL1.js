import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "../multipleChoice/MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import { TRANSLATE_WORD } from "../../ExerciseConstants.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";

// The user has to select the correct L1 translation out of three. The L2 word is marked in bold in the context.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceL2toL1;

export default function MultipleChoiceL2toL1({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  notifyOfUserAttempt,
  reload,
  setIsCorrect,
  isExerciseOver,
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
  const [prevTranslatedWords, setPrevTranslatedWords] = useState(0);
  const [translatedWords, setTranslatedWords] = useState([]);

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
    if (translatedWords.length > prevTranslatedWords) {
      setPrevTranslatedWords(translatedWords.length);
      notifyOfUserAttempt(TRANSLATE_WORD, exerciseBookmark);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWords]);

  useEffect(() => {
    if (!interactiveText) return;
    setButtonOptions(
      shuffle([
        removePunctuation(bookmarksToStudy[0].to),
        removePunctuation(bookmarksToStudy[1].to),
        removePunctuation(bookmarksToStudy[2].to),
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.to)) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
      setIsCorrect(false);
    }
  }

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <ExerciseInstructionHeader
        headline={strings.multipleChoiceL2toL1Headline}
        isExerciseOver={isExerciseOver}
      />

      <ContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={translatedWords}
        setTranslatedWords={setTranslatedWords}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        translating={true}
        pronouncing={false}
        highlightExpression={exerciseBookmark.from}
      />

      {isExerciseOver && bookmarkProgressBar && (
        <s.RevealedProgressBar>{bookmarkProgressBar}</s.RevealedProgressBar>
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
