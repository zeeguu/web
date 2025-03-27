import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "../multipleChoice/MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to select the correct L1 translation out of three. The L2 word is marked in bold in the context.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceL2toL1;

export default function MultipleChoiceL2toL1({
  bookmarksToStudy,
  exerciseMessageToAPI,
  setExerciseMessageToAPI,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  reload,
  setIsCorrect,
  isExerciseOver,
  resetSubSessionTimer,
}) {
  const api = useContext(APIContext);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);

  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.article_id,
        exerciseBookmark.context_in_content,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
      ),
    );
  }, [exerciseBookmark, reload]);

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
    // eslint-disable-next-line
  }, [interactiveText]);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.to)) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
      setIsCorrect(false);
      setExerciseMessageToAPI(exerciseMessageToAPI + "W");
    }
  }

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceL2toL1Headline}
      </div>
      <BookmarkProgressBar
        bookmark={exerciseBookmark}
        message={exerciseMessageToAPI}
      />

      {isExerciseOver && <h1>{removePunctuation(exerciseBookmark.to)}</h1>}

      <div className="contextExample">
        <TranslatableText
          isCorrect={isExerciseOver}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={exerciseBookmark.from}
          exerciseType={EXERCISE_TYPE}
          boldExpression={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
        />
      </div>

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
