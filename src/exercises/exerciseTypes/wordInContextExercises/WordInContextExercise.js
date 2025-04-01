import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { tokenize } from "../../../utils/text/preprocessing.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { APIContext } from "../../../contexts/APIContext.js";

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
  appendToExerciseMessageToAPI,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);

  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    resetSubSessionTimer();
    setExerciseType(exerciseType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.article_id,
        exerciseBookmark.context_in_content,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        exerciseType,
        speech,
      ),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  useEffect(() => {
    checkTranslations(translatedWords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedWords]);

  function equalAfterRemovingSpecialCharacters(a, b) {
    // from: https://stackoverflow.com/a/4328546
    let first = a.replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ");
    let second = b.replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ");
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
          if (
            equalAfterRemovingSpecialCharacters(translatedWord, wordInSolution)
          ) {
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
      appendToExerciseMessageToAPI("T");
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
      <div className="headlineWithMoreSpace">{exerciseHeadline}</div>
      <BookmarkProgressBar
        bookmark={exerciseBookmark}
        message={exerciseMessageToAPI}
      />
      <h1 className="wordInContextHeadline">
        {removePunctuation(exerciseBookmark.to)}
      </h1>
      <div className="contextExample">
        <TranslatableText
          isExerciseOver={isExerciseOver}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          bookmarkToStudy={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
        />
      </div>
      {showBottomInput && !isExerciseOver && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          messageToAPI={exerciseMessageToAPI}
          appendToExerciseMessageToAPI={appendToExerciseMessageToAPI}
        />
      )}
    </s.Exercise>
  );
}
