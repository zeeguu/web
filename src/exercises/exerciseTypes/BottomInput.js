import { useEffect, useState } from "react";
import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { normalizeAnswer } from "../inputNormalization";
import Pluralize from "../../utils/text/pluralize";
import { LANGUAGE_CODE_TO_NAME } from "../../utils/misc/languageCodeToName";

import {
  getExpressionlength,
  countCommonWords,
} from "../../utils/text/expressions";

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
  exerciseType,
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [distanceToCorrect, setDistanceToCorrect] = useState(0);
  const [isSameLengthAsSolution, setIsSameLengthAsSolution] = useState(false);
  const [isLongerThanSolution, setIsLongerThanSolution] = useState(false);
  const [isInputWrongLanguage, setIsInputWrongLanguage] = useState(false);
  const [correctWordCountInInput, setCorrectWordCountInInput] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const levenshtein = require("fast-levenshtein");

  const normalizedLearningWord = normalizeAnswer(bookmarksToStudy[0].from);

  const solutionText = isL1Answer
    ? bookmarksToStudy[0].to
    : bookmarksToStudy[0].from;

  const solutionWordCount = getExpressionlength(solutionText);
  const isWrongOrder =
    isIncorrect && correctWordCountInInput === solutionWordCount;

  const isPartOfExpressionCorrect =
    correctWordCountInInput >= 1 && solutionWordCount > 1 && isIncorrect;

  const answerLanguageCode = isL1Answer
    ? bookmarksToStudy[0].to_lang
    : bookmarksToStudy[0].from_lang;

  const inputLanguageName = LANGUAGE_CODE_TO_NAME[answerLanguageCode];

  function handleHint() {
    setUsedHint(true);
    let hint;
    const lowerCurrentInput = currentInput.toLowerCase();
    const lowerTargetWord = solutionText.toLowerCase();
    if (
      lowerCurrentInput ===
      lowerTargetWord.substring(0, lowerCurrentInput.length)
    ) {
      hint = solutionText.substring(0, currentInput.length + 1);
    } else {
      hint = solutionText.substring(0, 1);
    }
    setCurrentInput(hint);
    setMessageToAPI(messageToAPI + "H");
  }

  // Update the feedback message
  useEffect(() => {
    if (isInputWrongLanguage) {
      setFeedbackMessage("Correct, but wrong language 😉");
      return;
    }

    if (distanceToCorrect < 5 && distanceToCorrect > 2 && !isWrongOrder) {
      setFeedbackMessage(
        `❌ Not quite the ${Pluralize.wordExpression(solutionWordCount)}`,
      );
      return;
    }
    if (distanceToCorrect === 2) {
      setFeedbackMessage("⭐ You are almost there");
      return;
    }
    if (distanceToCorrect === 1) {
      if (isSameLengthAsSolution) {
        setFeedbackMessage("⭐ You need to change 1 letter");
        return;
      }
      if (isLongerThanSolution) {
        setFeedbackMessage("⭐ You need to remove 1 letter");
        return;
      }
      if (!isLongerThanSolution && !isSameLengthAsSolution) {
        setFeedbackMessage("⭐ You need to add 1 letter");
        return;
      }
    }
    if (isPartOfExpressionCorrect) {
      if (isWrongOrder) setFeedbackMessage(`⭐ Check the word order`);
      else
        setFeedbackMessage(
          `⭐ You got ${correctWordCountInInput}/${solutionWordCount} words correct`,
        );
      return;
    }
    setFeedbackMessage("");
    // eslint-disable-next-line
  }, [
    distanceToCorrect,
    isSameLengthAsSolution,
    isLongerThanSolution,
    isInputWrongLanguage,
  ]);

  function checkResult() {
    if (currentInput === "") {
      setFeedbackMessage("");
      return;
    }

    let normalizedInput = normalizeAnswer(currentInput);
    let normalizedAnswer = normalizeAnswer(solutionText);
    let levDistance = levenshtein.get(normalizedInput, normalizedAnswer);

    let userHasTypoInNativeLanguage = isL1Answer && levDistance === 1;
    if (normalizedInput === normalizedAnswer || userHasTypoInNativeLanguage) {
      //this allows for a typo in the native language
      handleCorrectAnswer(messageToAPI + "C");
      setIsIncorrect(false);
      return;
    }
    let totalWordsCorrect = countCommonWords(normalizedInput, normalizedAnswer);

    setCorrectWordCountInInput(totalWordsCorrect);
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
    } else if (totalWordsCorrect >= 1 && solutionWordCount > 1) {
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
            placeholder={"Type in " + inputLanguageName}
            className={
              distanceToCorrect >= 5 && correctWordCountInInput === 0
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
