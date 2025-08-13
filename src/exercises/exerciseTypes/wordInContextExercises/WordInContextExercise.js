import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { tokenize } from "../../../utils/text/preprocessing.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import InteractiveExerciseText from "../../../reader/InteractiveExerciseText.js";

//shared code for ClickWordInContext and FindWordInContext exercises
//The difference between the two is that in FindWordInContext the user can choose to either click on the word or type the word.

export default function WordInContextExercise({
  exerciseType,
  exerciseHeadline,
  showBottomInput,
  notifyExerciseCompleted,
  notifyShowSolution,
  reload,
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  isExerciseOver,
  setIsCorrect,
  resetSubSessionTimer,
  exerciseMessageToAPI,
  notifyOfUserAttempt,
  bookmarkProgressBar,
  onExampleUpdated,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);

  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(exerciseType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Validate that context_tokenized exists and is properly formatted
    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    const onSolutionFound = (word) => {
      // Check how many translations were made
      let translationCount = 0;
      for (let i = 0; i < exerciseMessageToAPI.length; i++) {
        if (exerciseMessageToAPI[i] === "T") translationCount++;
      }
      if (translationCount < 1) {
        notifyCorrectAnswer(exerciseBookmark);
      } else {
        notifyShowSolution();
      }
    };

    const expectedPosition = {
      sentenceIndex: exerciseBookmark.t_sentence_i,
      tokenIndex: exerciseBookmark.t_token_i,
      totalTokens: exerciseBookmark.t_total_token || 1,
      contextOffset: exerciseBookmark.context_sent || 0
    };


    setInteractiveText(
      new InteractiveExerciseText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        exerciseType,
        speech,
        exerciseBookmark.context_identifier,
        null, // formatting
        exerciseBookmark.from, // expectedSolution
        expectedPosition, // expectedPosition
        onSolutionFound,
      ),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);


  function handleIncorrectAnswer() {
    //alert("incorrect answer")
    notifyIncorrectAnswer(exerciseBookmark);
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className={exerciseType}>
      <div className="headlineWithMoreSpace" style={{ visibility: isExerciseOver ? "hidden" : "visible" }}>
        {exerciseHeadline}
      </div>
      <h1 className="wordInContextHeadline">{removePunctuation(exerciseBookmark.to)}</h1>
      <div style={{ visibility: isExerciseOver ? "visible" : "hidden", minHeight: "60px" }}>
        {bookmarkProgressBar || <div style={{ height: "60px", width: "30%", margin: "0.1em auto 0.5em auto" }}></div>}
      </div>
      <ContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        highlightExpression={isExerciseOver ? exerciseBookmark.from : null}
      />
      {showBottomInput && !isExerciseOver && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
        />
      )}
    </s.Exercise>
  );
}
