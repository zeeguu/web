import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";

import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";

const EXERCISE_TYPE = "Select_L2W_fitting_L2T";

export default function MultipleChoice({
  api,
  bookmarkToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
  shuffle,
}) {
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [initialTime] = useState(new Date());
  const [buttonOptions, setButtonOptions] = useState(null);
  const [messageToAPI, setMessageToAPI] = useState("");

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.wordsSimilarTo(bookmarkToStudy.id, (words) => {
      consolidateChoiceOptions(words);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function colorWordInContext(context, word) {
    return context.replace(
      word,
      `<span class='highlightedWord'>${word}</span>`
    );
  }

  function notifyChoiceSelection(selectedChoice) {
    console.log("checking result...");
    if (selectedChoice === bookmarkToStudy.from) {
      correctAnswer(bookmarkToStudy);
      setIsCorrect(true);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(bookmarkToStudy);
      let concatMessage = messageToAPI + "W";
      setMessageToAPI(concatMessage);
    }
  }

  function handleAnswer(message) {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");

    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      pressTime - initialTime,
      bookmarkToStudy.id
    );
  }

  function contextWithMissingWord(context, missingWord) {
    return context.replace(missingWord, "______");
  }

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      bookmarkToStudy.from,
      similarWords[firstRandomInt],
      similarWords[secondRandomInt],
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);
    setButtonOptions(shuffledListOfOptions);
  }

  return (
    <s.Exercise>
      <h3>{strings.chooseTheWordFittingContextHeadline}</h3>
      {isCorrect && <h1>{bookmarkToStudy.to}</h1>}
      <div className="contextExample">
        <div
          dangerouslySetInnerHTML={{
            __html: isCorrect
              ? colorWordInContext(
                  bookmarkToStudy.context,
                  bookmarkToStudy.from
                )
              : contextWithMissingWord(
                  bookmarkToStudy.context,
                  bookmarkToStudy.from
                ),
          }}
        />
      </div>
      {!buttonOptions && <LoadingAnimation />}
      {!isCorrect && (
        <MultipleChoicesInput
          buttonOptions={buttonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
          setIncorrectAnswer={setIncorrectAnswer}
        />
      )}
      {isCorrect && (
        <NextNavigation
          api={api}
          bookmarkToStudy={bookmarkToStudy}
          moveToNextExercise={moveToNextExercise}
        />
      )}
    </s.Exercise>
  );
}
