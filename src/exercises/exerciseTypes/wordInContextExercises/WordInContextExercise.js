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
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);

  const exerciseBookmark = bookmarksToStudy[0];

  // Debug logging for ClickWordInContext issue
  console.log("[ClickWordInContext Debug] Exercise initialized with bookmark:", {
    bookmarkId: exerciseBookmark?.id,
    userWordId: exerciseBookmark?.user_word_id,
    from: exerciseBookmark?.from,
    to: exerciseBookmark?.to,
    context: exerciseBookmark?.context,
    contextTokenized: exerciseBookmark?.context_tokenized,
    sentenceI: exerciseBookmark?.t_sentence_i,
    tokenI: exerciseBookmark?.t_token_i,
  });

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

    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        exerciseType,
        speech,
        exerciseBookmark.context_identifier,
      ),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  useEffect(() => {
    checkTranslations(translatedWords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWords]);

  function equalAfterRemovingSpecialCharacters(word1, word2) {
    // from: https://stackoverflow.com/a/4328546
    // TR (28-03-2025) We need to support cases where the word might be word1: childrens', word2:childrens
    // This now happens since the tokenizer doesn't reflect what is being done at the server.
    const removeSpecialChars = /[^\w\s']|_/g;

    let first = word1.replace(removeSpecialChars, "").replace(/\s+/g, " ");
    if (first[first.length - 1] === "'") first = first.slice(0, -1);
    let second = word2.replace(removeSpecialChars, "").replace(/\s+/g, " ");
    return first === second;
  }

  function checkTranslations(userTranslatedSequences) {
    if (userTranslatedSequences.length === 0) {
      return;
    }
    let solutionDiscovered = false;
    let solutionSplitIntoWords = tokenize(exerciseBookmark.from);

    solutionSplitIntoWords.forEach((wordInSolution) => {
      userTranslatedSequences.forEach((userTranslatedSequence) => {
        let wordsInUserTranslatedSequence = userTranslatedSequence.split(" ");
        wordsInUserTranslatedSequence.forEach((translatedWord) => {
          // Make the comparison case-insensitive
          if (equalAfterRemovingSpecialCharacters(translatedWord.toLowerCase(), wordInSolution.toLowerCase())) {
            solutionDiscovered = true;
          }
        });
      });
    });

    if (solutionDiscovered && !isCorrect) {
      // Check how many translations were made
      let translationCount = 0;
      for (let i = 0; i < exerciseMessageToAPI.length; i++) {
        if (exerciseMessageToAPI[i] === "T") translationCount++;
      }
      if (translationCount < 2) {
        notifyCorrectAnswer(exerciseBookmark);
      } else {
        notifyShowSolution();
      }
    } else {
      notifyOfUserAttempt("T", exerciseBookmark);
    }
  }

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
        translatedWords={translatedWords}
        setTranslatedWords={setTranslatedWords}
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
