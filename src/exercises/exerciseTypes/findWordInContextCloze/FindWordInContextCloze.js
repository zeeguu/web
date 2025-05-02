import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";

import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import BottomInput from "../BottomInput.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to type the correct translation of a given L1 word in a L2 context. The L2 word is omitted in the context, so the user has to fill in the blank.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.findWordInContextCloze;

export default function FindWordInContextCloze({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyExerciseCompleted,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  setIsCorrect,
  appendToExerciseMessageForAPI,
  reload,
  bookmarkProgressBar,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_identifier,
      ),
    );
    // eslint-disable-next-line
  }, [reload, exerciseBookmark]);

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(exerciseBookmark);
  }

  return (
    <s.Exercise className="findWordInContextCloze">
      <div className="headlineWithMoreSpace">{strings.findWordInContextClozeHeadline}</div>
      {bookmarkProgressBar}
      <h1 className="wordInContextHeadline">{removePunctuation(exerciseBookmark.to)}</h1>
      <div className="contextExample">
        <TranslatableText
          isExerciseOver={isExerciseOver}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
        />
      </div>

      {!isExerciseOver && (
        <>
          <BottomInput
            handleCorrectAnswer={notifyCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            handleExerciseCompleted={notifyExerciseCompleted}
            setIsCorrect={setIsCorrect}
            exerciseBookmark={exerciseBookmark}
            appendToExerciseMessageForAPI={appendToExerciseMessageForAPI}
          />
        </>
      )}
    </s.Exercise>
  );
}
