import { useEffect, useState } from "react";
import removeAccents from "remove-accents";
import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants";

function getFlagImageUrl(languageCode) {
  return `/static/flags/${languageCode}.png`;
}

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
  const [isInputWrongLanguage, setIsInputWrongLanguage] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const levenshtein = require("fast-levenshtein");

  const learningWord = removeQuotes(
    removeAccents(eliminateTypos(bookmarksToStudy[0].from)),
  );

  let countryFlag = isL1Answer
    ? bookmarksToStudy[0].to_lang
    : bookmarksToStudy[0].from_lang;

  function handleHint() {
    setUsedHint(true);

    if (exerciseType === EXERCISE_TYPES.translateWhatYouHear) {
      onHintUsed();
      let concatMessage = messageToAPI + "H";
      setMessageToAPI(concatMessage);
    } else {
      let hint;
      let targetWord = isL1Answer
        ? bookmarksToStudy[0].to
        : bookmarksToStudy[0].from;
      if (currentInput === targetWord.substring(0, currentInput.length)) {
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
    if (isInputWrongLanguage) {
      setFeedbackMessage("Correct, but wrong language! 😉");
      return;
    }
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
  }, [
    distanceToCorrect,
    isSameLengthAsSolution,
    isLongerThanSolution,
    isInputWrongLanguage,
  ]);

  function checkResult() {
    if (currentInput === "") {
      return;
    }
    console.log("checking result...");
    let a = removeQuotes(removeAccents(eliminateTypos(currentInput)));
    let b = removeQuotes(
      removeAccents(
        eliminateTypos(
          isL1Answer ? bookmarksToStudy[0].to : bookmarksToStudy[0].from,
        ),
      ),
    );
    let levDistance = levenshtein.get(a, b);
    let concatMessage = messageToAPI;
    setIsInputWrongLanguage(false);
    setIsLongerThanSolution(a.length > b.length);
    setIsSameLengthAsSolution(a.length === b.length);
    setDistanceToCorrect(levDistance);

    let userUsedWrongLang = isL1Answer && a === learningWord;
    let userHasTypoInNativeLanguage = isL1Answer && levDistance === 1;
    if (a === b || userHasTypoInNativeLanguage) {
      //this allows for a typo in the native language
      concatMessage += "C";
      handleCorrectAnswer(concatMessage);
      return;
    } else if (userUsedWrongLang) {
      // If the user writes in the wrong language
      // we give them an Hint, mainly for audio exercises.
      concatMessage += "H";
      setIsInputWrongLanguage(true);
      setDistanceToCorrect();
    } else if (levDistance === 1) {
      // The user almost got it correct
      // we associate it with a H
      concatMessage += "H";
    } else {
      concatMessage += "W";
      handleIncorrectAnswer();
    }
    setMessageToAPI(concatMessage);
    setIsIncorrect(true);
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
            style={{
              paddingLeft: "1.5em",
              backgroundImage: `url(${getFlagImageUrl(countryFlag)})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "1em 1em",
              backgroundPosition: "left center",
              backgroundPositionX: "0.4em",
            }}
          />
        </div>

        <s.RightFeedbackButton onClick={checkResult}>
          {strings.check}
        </s.RightFeedbackButton>
      </s.BottomRow>
    </>
  );
}
