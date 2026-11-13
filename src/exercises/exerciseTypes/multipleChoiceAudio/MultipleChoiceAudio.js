import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";
import shuffle from "../../../assorted/fisherYatesShuffle.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import MultipleChoiceAudioBottomInput from "./MultipleChoiceAudioBottomInput.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import { AnswerLine, withBoldParts } from "../../components/AnswerNote.js";

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
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const [choiceOptions, setChoiceOptions] = useState(null);
  const [currentSelectedChoice, setCurrentSelectedChoice] = useState("");
  // The last wrong pick, so the learner sees it was wrong and what they
  // actually heard. `attempt` restarts the shake when the same option is
  // picked wrong twice in a row.
  const [wrongPick, setWrongPick] = useState(null);

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType: EXERCISE_TYPE });

  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType: EXERCISE_TYPE,
    reload,
    onExerciseLoaded,
  });

  useEffect(() => {
    // Index 0 is the correct bookmark; 1 and 2 are distractors.
    setChoiceOptions(shuffle([0, 1, 2]));
    setCurrentSelectedChoice("");
    setWrongPick(null);
    if (!SessionStorage.isAudioExercisesEnabled()) moveToNextExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, exerciseBookmark]);

  function onWrongPick(option) {
    setCurrentSelectedChoice("");
    setWrongPick((previous) => ({ option, attempt: (previous?.attempt || 0) + 1 }));
  }

  if (!interactiveText || !choiceOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      <ExerciseInstructionHeader
        headline={strings.multipleChoiceAudioHeadline}
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
        inputValue=""
        placeholder=""
        isCorrectAnswer={false}
        shouldFocus={false}
        showHint={false}
        canTypeInline={false}
      />

      {!isExerciseOver && (
        <div style={{ marginTop: "2em" }}>
          <s.CenteredWordRow>
            {choiceOptions.map((option) => {
              const button = (
                <SpeakButton
                  onClickCallback={() => setCurrentSelectedChoice(option)}
                  isSelected={option === currentSelectedChoice}
                  bookmarkToStudy={bookmarksToStudy[option]}
                  id={option}
                  styling={option === currentSelectedChoice ? "selected" : ""}
                />
              );
              return wrongPick?.option === option ? (
                <s.ShakeOnce key={`${option}-${wrongPick.attempt}`}>{button}</s.ShakeOnce>
              ) : (
                <span key={option}>{button}</span>
              );
            })}
          </s.CenteredWordRow>
          {wrongPick && (
            <AnswerLine>
              {withBoldParts(
                strings.wrongAudioPickTryAgain,
                bookmarksToStudy[wrongPick.option].from,
                bookmarksToStudy[wrongPick.option].to,
              )}
            </AnswerLine>
          )}
        </div>
      )}

      {isExerciseOver && bookmarkProgressBar && (
        <s.RevealedProgressBar>{bookmarkProgressBar}</s.RevealedProgressBar>
      )}

      {!isExerciseOver && (
        <MultipleChoiceAudioBottomInput
          bookmarksToStudy={bookmarksToStudy}
          currentChoice={currentSelectedChoice}
          targetBookmark={exerciseBookmark}
          notifyCorrectAnswer={notifyCorrectAnswer}
          notifyIncorrectAnswer={notifyIncorrectAnswer}
          onWrongPick={onWrongPick}
        />
      )}
    </s.Exercise>
  );
}
