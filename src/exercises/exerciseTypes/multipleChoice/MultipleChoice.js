import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";

import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";

// The user has to select the correct L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoice;

export default function MultipleChoice({
  api,
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyExerciseCompleted,
  notifyIncorrectAnswer,
  notifyShowSolution,
  isShowSolution,
  exerciseCompletedNotification,
  setSelectedExerciseBookmark,
  setExerciseType,
  isCorrect,
  reload,
  isExerciseOver,
  setIsCorrect,
  resetSubSessionTimer,
}) {
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [messageToAPI, setMessageToAPI] = useState("");
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    resetSubSessionTimer();
  }, []);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setSelectedExerciseBookmark(bookmarksToStudy[0]);
    api.wordsSimilarTo(bookmarksToStudy[0].id, (words) => {
      consolidateChoiceOptions(words);
    });
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  function notifyChoiceSelection(selectedChoice) {
    if (
      selectedChoice === removePunctuation(exerciseBookmark.from.toLowerCase())
    ) {
      notifyCorrectAnswer(exerciseBookmark);
      setIsCorrect(true);
      let concatMessage = messageToAPI + "C";
      notifyExerciseCompleted(concatMessage);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
      let concatMessage = messageToAPI + "W";
      setIsCorrect(false);
      setMessageToAPI(concatMessage);
    }
  }

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      removePunctuation(exerciseBookmark.from.toLowerCase()),
      removePunctuation(similarWords[firstRandomInt].toLowerCase()),
      removePunctuation(similarWords[secondRandomInt].toLowerCase()),
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);
    setButtonOptions(shuffledListOfOptions);
  }

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <div className="headlineWithMoreSpace">
        {strings.chooseTheWordFittingContextHeadline}
      </div>
      <BookmarkProgressBar bookmark={exerciseBookmark} message={messageToAPI} />

      {isExerciseOver && <h1>{removePunctuation(bookmarksToStudy[0].to)}</h1>}

      <div className="contextExample">
        <TranslatableText
          isCorrect={isExerciseOver}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={exerciseBookmark.from}
          exerciseType={EXERCISE_TYPE}
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
