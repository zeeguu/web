import { useEffect, useState } from "react";
import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants";
import { normalizeAnswer } from "../inputNormalization";

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
  const [isOneWordCorrect, setIsOneWordCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [firstHint, setFirstHint] = useState(true);
  const levenshtein = require("fast-levenshtein");

  const normalizedLearningWord = normalizeAnswer(bookmarksToStudy[0].from);

  const targetWord = isL1Answer
    ? bookmarksToStudy[0].to
    : bookmarksToStudy[0].from;

  const answerLanguageCode = isL1Answer
    ? bookmarksToStudy[0].to_lang
    : bookmarksToStudy[0].from_lang;

  function handleHint() {
    if (exerciseType === EXERCISE_TYPES.translateWhatYouHear && firstHint) {
      setFirstHint(false);
      onHintUsed();
    } else {
      setUsedHint(true);
      let hint;
      if (currentInput === targetWord.substring(0, currentInput.length)) {
        hint = targetWord.substring(0, currentInput.length + 1);
      } else {
        hint = targetWord.substring(0, 1);
      }
      setCurrentInput(hint);
      setMessageToAPI(messageToAPI + "H");
    }
  }

  // Update the feedback message
  useEffect(() => {
    if (isInputWrongLanguage) {
      setFeedbackMessage("Correct, but wrong language! 😉");
      return;
    }
    if (isOneWordCorrect) {
      setFeedbackMessage("⭐ You are still missing a word!");
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

    let normalizedInput = normalizeAnswer(currentInput);
    let normalizedAnswer = normalizeAnswer(targetWord);
    let levDistance = levenshtein.get(normalizedInput, normalizedAnswer);

    let userHasTypoInNativeLanguage = isL1Answer && levDistance === 1;
    if (normalizedInput === normalizedAnswer || userHasTypoInNativeLanguage) {
      //this allows for a typo in the native language
      handleCorrectAnswer(messageToAPI + "C");
      return;
    }

    let isOneWordCorrect = false;
    let wordsInAnswer = normalizedAnswer.split(" ");
    normalizedInput.split("   ").forEach((word) => {
      console.log(wordsInAnswer, word);
      if (wordsInAnswer.includes(word)) isOneWordCorrect = true;
    });

    setIsOneWordCorrect(isOneWordCorrect);
    setDistanceToCorrect(levDistance);
    setIsLongerThanSolution(normalizedInput.length > normalizedAnswer.length);
    setIsSameLengthAsSolution(
      normalizedInput.length === normalizedAnswer.length,
    );

    let updatedMessageToAPI;
    let userUsedWrongLang =
      isL1Answer && normalizedInput === normalizedLearningWord;
    setIsInputWrongLanguage(userUsedWrongLang);

    if (userUsedWrongLang) {
      // If the user writes in the wrong language
      // we give them a Hint, mainly for audio exercises.
      updatedMessageToAPI = messageToAPI + "H";
      setDistanceToCorrect();
    } else if (isOneWordCorrect) {
      updatedMessageToAPI = messageToAPI + "H";
    } else if (levDistance === 1) {
      // The user almost got it correct
      // we associate it with a H
      updatedMessageToAPI = messageToAPI + "H";
    } else {
      updatedMessageToAPI = messageToAPI + "W";
      handleIncorrectAnswer();
    }
    setMessageToAPI(updatedMessageToAPI);
    setIsIncorrect(true);
  }

  const InputField = isIncorrect ? s.AnimatedInput : s.Input;
  return (
    <>
      <s.BottomRow className="bottomRow">
        <s.LeftFeedbackButton onClick={() => handleHint()} disabled={usedHint}>
          {strings.hint}
        </s.LeftFeedbackButton>
        <div>
          <div className="type-feedback">
            {feedbackMessage !== "" && <p>{feedbackMessage}</p>}
          </div>
          <InputField
            type="text"
            className={
              distanceToCorrect >= 5 && !isOneWordCorrect
                ? "wrong-border"
                : "almost-border"
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
              backgroundImage: `url(${getFlagImageUrl(answerLanguageCode)})`,
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
