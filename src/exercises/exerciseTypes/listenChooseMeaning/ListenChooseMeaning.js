import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
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
import ContextWithExchange from "../../components/ContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";

// For learners at A0, who know their words only by ear: they hear the word and
// pick what it means, out of three meanings in their own language. Nothing in
// the language being learned is written until they have answered; then the
// word is shown in the dialogue line it came from -- the first time they see
// it spelled.
//
// It plays whatever the audio-exercises setting says, and does not offer
// "can't use audio right now" (it is not in EXERCISE_TYPES.isAudioExercise):
// at A0 it is the only exercise, so stepping aside would leave an empty
// session. A learner who cannot listen now simply leaves the session.

const EXERCISE_TYPE = EXERCISE_TYPES.listenChooseMeaning;

export default function ListenChooseMeaning({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
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
  const [translatedWords, setTranslatedWords] = useState([]);

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType: EXERCISE_TYPE });

  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType: EXERCISE_TYPE,
    reload,
    onExerciseLoaded,
  });

  // Not waiting for interactiveText: the written context is only shown after
  // the answer, so the exercise must not hang on it.
  // Keyed on the word, not the bookmark object: changing the example after the
  // answer replaces the object, and must not replay the word or reshuffle.
  useEffect(() => {
    setButtonOptions(shuffle(bookmarksToStudy.slice(0, 3).map((b) => removePunctuation(b.to || ""))));
    // The browser may refuse to play before the user has interacted with the
    // page; the button below plays it again.
    Promise.resolve(speech.speakOut(exerciseBookmark.from)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, exerciseBookmark.id]);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.to || "")) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
      setIsCorrect(false);
    }
  }

  if (!buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <ExerciseInstructionHeader headline={strings.listenChooseMeaningHeadline} isExerciseOver={isExerciseOver} />

      {!isExerciseOver && (
        <s.CenteredWordRow style={{ margin: "1.5em 0" }}>
          <SpeakButton bookmarkToStudy={exerciseBookmark} styling="large" />
        </s.CenteredWordRow>
      )}

      {isExerciseOver && interactiveText && (
        <ContextWithExchange
          exerciseBookmark={exerciseBookmark}
          interactiveText={interactiveText}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          isExerciseOver={isExerciseOver}
          onExampleUpdated={onExampleUpdated}
          translating={false}
          pronouncing={true}
          highlightExpression={exerciseBookmark.from}
        />
      )}

      {isExerciseOver && bookmarkProgressBar && <s.RevealedProgressBar>{bookmarkProgressBar}</s.RevealedProgressBar>}

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
