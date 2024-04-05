import { useEffect, useState } from "react";
import removeAccents from "remove-accents";
import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import CountryFlags from "./CountryFlags";
import exerciseTypes from "../ExerciseTypeConstants";

export default function BottomInput({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  bookmarksToStudy,
  messageToAPI,
  setMessageToAPI,
  isL1Answer,
  onHintUsed,
  exerciseType,
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [distanceToCorrect, setDistanceToCorrect] = useState(0);
  const [isSameLengthAsSolution, setIsSameLengthAsSolution] = useState(false);
  const [isLongerThanSolution, setIsLongerThanSolution] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const levenshtein = require("fast-levenshtein");

  let flag = isL1Answer ? bookmarksToStudy[0].to_lang : bookmarksToStudy[0].from_lang;

  function handleHint() {
    setUsedHint(true);

    if (exerciseType === exerciseTypes.translateWhatYouHear) {
      onHintUsed();
      let concatMessage = messageToAPI + "H";
      setMessageToAPI(concatMessage);
    } else {
      let hint;
      let targetWord = isL1Answer ? bookmarksToStudy[0].to : bookmarksToStudy[0].from;
      if (
        currentInput ===
        targetWord.substring(0, currentInput.length)
      ) {
        hint = targetWord.substring(0, currentInput.length + 1);
      } else {
        hint = targetWord.substring(0, 1);
      }
      setCurrentInput(hint);
      let concatMessage = messageToAPI + "H";
      setMessageToAPI(concatMessage);
    }
  }

  function eliminateTypos(x) {
    return x.trim().toUpperCase();
    // .replace(/[^a-zA-Z ]/g, '')
  }

  function removeQuotes(x) {
    return x.replace(/[^a-zA-Z ]/g, "");
  }

  // Update the feedback message
  useEffect(() => {
    if (distanceToCorrect < 5 && distanceToCorrect > 2) {
      setFeedbackMessage("❌ Not quite the word!");
      return;
    }
    if (distanceToCorrect === 2) {
      setFeedbackMessage("⭐ You are almost there!");
      return;
    }
    if (distanceToCorrect === 1) {
      if (isSameLengthAsSolution) {
        setFeedbackMessage("⭐ You need to change 1 letter!");
        return;
      }
      if (isLongerThanSolution) {
        setFeedbackMessage("⭐ You need to remove 1 letter!");
        return;
      }
      if (!isLongerThanSolution && !isSameLengthAsSolution) {
        setFeedbackMessage("⭐ You need to add 1 letter!");
        return;
      }
    }
    setFeedbackMessage("");
  }, [distanceToCorrect, isSameLengthAsSolution, isLongerThanSolution]);

  function checkResult() {
    if (currentInput === "") {
      return;
    }
    console.log("checking result...");
    let a = removeQuotes(removeAccents(eliminateTypos(currentInput)));
    let b = removeQuotes(
      removeAccents(eliminateTypos(isL1Answer ? bookmarksToStudy[0].to : bookmarksToStudy[0].from)),
    );
    if (a === b) {
      let concatMessage = messageToAPI + "C";
      handleCorrectAnswer(concatMessage);
    } else {
      let concatMessage = messageToAPI + "W";
      let levDistance = levenshtein.get(a, b);
      setIsLongerThanSolution(a.length > b.length);
      setIsSameLengthAsSolution(a.length === b.length);
      console.log("You are this far: " + levDistance);
      setDistanceToCorrect(levDistance);
      setMessageToAPI(concatMessage);
      setIsIncorrect(true);
      handleIncorrectAnswer();
    }
  }

  const InputField = isIncorrect ? s.AnimatedInput : s.Input;
  return (
    <>
      <s.BottomRow className="bottomRow">
        <s.LeftFeedbackButton onClick={(e) => handleHint()} disabled={usedHint}>
          {strings.hint}
        </s.LeftFeedbackButton>
        <div>
          <div className="type-feedback">
            {feedbackMessage !== "" && <p>{feedbackMessage}</p>}
          </div>
          <CountryFlags languageCode={flag}/>
          <InputField
            type="text"
            className={
              distanceToCorrect >= 5 ? "wrong-border" : "almost-border"
            }
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                checkResult();
              }
            }}
            onAnimationEnd={() => setIsIncorrect(false)}
            autoFocus
          />
        </div>
        <s.RightFeedbackButton onClick={checkResult}>
          {strings.check}
        </s.RightFeedbackButton>
      </s.BottomRow>
    </>
  );
}
