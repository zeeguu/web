import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "../multipleChoice/MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import LearningCycleIndicator from "../../LearningCycleIndicator.js";

// The user has to select the correct L1 translation out of three. The L2 word is marked in bold in the context.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceL2toL1;

export default function MultipleChoiceL2toL1({
  api,
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
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [messageToAPI, setMessageToAPI] = useState("");
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);
  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.article_id,
        false,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
      ),
    );
  }, [isBookmarkChanged]);

  useEffect(() => {
    if (interactiveText) {
      setButtonOptions(
        shuffle([
          removePunctuation(bookmarksToStudy[0].to),
          removePunctuation(bookmarksToStudy[1].to),
          removePunctuation(bookmarksToStudy[2].to),
        ]),
      );
    }
  }, [interactiveText]);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.to)) {
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

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(exerciseBookmark);
    setIsCorrect(true);
    handleAnswer(message);
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

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceL2toL1Headline}
      </div>
      <LearningCycleIndicator
        bookmark={exerciseBookmark}
        message={messageToAPI}
      />

      {isCorrect && <h1>{removePunctuation(exerciseBookmark.to)}</h1>}

      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={exerciseBookmark.from}
          exerciseType={EXERCISE_TYPE}
          boldExpression={exerciseBookmark.from}
        />
      </div>

      {!buttonOptions && <LoadingAnimation />}
      {!isCorrect && (
        <MultipleChoicesInput
          buttonOptions={buttonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
          setIncorrectAnswer={setIncorrectAnswer}
          handleShowSolution={handleShowSolution}
          toggleShow={toggleShow}
        />
      )}
      <NextNavigation
        exerciseType={EXERCISE_TYPE}
        message={messageToAPI}
        api={api}
        exerciseBookmark={exerciseBookmark}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
        isBookmarkChanged={() => setIsBookmarkChanged(!isBookmarkChanged)}
      />
    </s.Exercise>
  );
}
