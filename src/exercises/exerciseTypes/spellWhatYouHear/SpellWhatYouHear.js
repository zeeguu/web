import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to write the word they hear. A context with the word omitted is shown.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.spellWhatYouHear;

export default function SpellWhatYouHear({
  bookmarksToStudy,
  notifyOfUserAttempt,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  notifyExerciseCompleted,
  setIsCorrect,
  setExerciseType,
  moveToNextExercise,
  reload,
  isExerciseOver,
  resetSubSessionTimer,
  bookmarkProgressBar,
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState();
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const exerciseBookmark = bookmarksToStudy[0];

  async function handleSpeak() {
    setShouldFocusInput(false); // Unfocus during speech
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
    // Focus after speech is done
    setTimeout(() => {
      setShouldFocusInput(true);
    }, 100);
  }

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!SessionStorage.isAudioExercisesEnabled()) moveToNextExercise();

    setInputValue("");
    setIsCorrectAnswer(false);

    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    const adaptedBookmark = adaptExerciseBookmark(exerciseBookmark);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        adaptedBookmark ? [adaptedBookmark] : [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_identifier,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  useEffect(() => {
    // Defer speak so the page renders first and the user can gain focus.
    if (interactiveText && !isButtonSpeaking)
      setTimeout(() => {
        handleSpeak();
      }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(exerciseBookmark);
  }

  function handleInputChange(value) {
    setInputValue(value);

    const userInput = value.trim().toLowerCase();
    const expectedAnswer = removePunctuation(exerciseBookmark.from).toLowerCase();
    const isCorrect = userInput === expectedAnswer;
    setIsCorrectAnswer(isCorrect);

    // Wait just long enough for the colour transition on the typed word
    // to land before swapping the UI to the exercise-over state.
    if (isCorrect && value.trim().length > 0) {
      setTimeout(() => {
        notifyCorrectAnswer(exerciseBookmark);
      }, 450);
    }
  }

  function handleInputSubmit(value) {
    const userInput = value.trim().toLowerCase();
    const expectedAnswer = removePunctuation(exerciseBookmark.from).toLowerCase();
    if (userInput === expectedAnswer) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      notifyOfUserAttempt(value, exerciseBookmark);
      handleIncorrectAnswer();
    }
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="spellWhatYouHear">
      <ExerciseInstructionHeader
        headline={strings.audioExerciseHeadline}
        isExerciseOver={isExerciseOver}
      />

      {/* Context - always at the top, never moves */}
      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        onInputChange={handleInputChange}
        onInputSubmit={handleInputSubmit}
        inputValue={inputValue}
        placeholder=""
        isCorrectAnswer={isCorrectAnswer}
        shouldFocus={shouldFocusInput}
        canTypeInline={true}
      />

      {/* Solution slot below context — fixed height so context doesn't
          shift between exercise and reveal. Post-reveal the L1 chip
          surfaces above the highlighted word, so only the progress bar
          lives here. */}
      <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2em' }}>
        {!isExerciseOver ? (
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={exerciseBookmark}
              styling="large"
              parentIsSpeakingControl={isButtonSpeaking}
            />
          </s.CenteredRowTall>
        ) : (
          bookmarkProgressBar
        )}
      </div>
    </s.Exercise>
  );
}
