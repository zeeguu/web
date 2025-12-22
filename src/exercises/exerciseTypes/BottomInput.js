import { useEffect, useState, useContext, useRef } from "react";
import levenshtein from "fast-levenshtein";
import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { normalizeAnswer } from "../inputNormalization";
import Pluralize from "../../utils/text/pluralize";
import { LANGUAGE_CODE_TO_NAME } from "../../utils/misc/languageCodeToName";
import { needsVirtualKeyboard } from "../../utils/misc/languageScripts";
import VirtualKeyboard from "../../components/VirtualKeyboard/VirtualKeyboard";
import { UserContext } from "../../contexts/UserContext";

import { getExpressionlength, countCommonWords } from "../../utils/text/expressions";
import { HINT, WRONG } from "../ExerciseConstants";

// Check localStorage for keyboard collapsed state
const getInitialKeyboardCollapsed = () => {
  try {
    const saved = localStorage.getItem('zeeguu_virtual_keyboard_collapsed');
    return saved !== null ? JSON.parse(saved) : false; // Default to expanded (false)
  } catch (e) {
    return false;
  }
};

function getFlagImageUrl(languageCode) {
  return `/static/flags/${languageCode}.png`;
}

export default function BottomInput({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  setIsCorrect,
  exerciseBookmark,
  notifyOfUserAttempt,
  isL1Answer,
}) {
  const { userDetails } = useContext(UserContext);
  const [currentInput, setCurrentInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [distanceToCorrect, setDistanceToCorrect] = useState(0);
  const [isSameLengthAsSolution, setIsSameLengthAsSolution] = useState(false);
  const [isLongerThanSolution, setIsLongerThanSolution] = useState(false);
  const [isInputWrongLanguage, setIsInputWrongLanguage] = useState(false);
  const [correctWordCountInInput, setCorrectWordCountInInput] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isKeyboardCollapsed, setIsKeyboardCollapsed] = useState(getInitialKeyboardCollapsed);
  const inputRef = useRef(null);
  const normalizedLearningWord = normalizeAnswer(exerciseBookmark.from);

  const solutionText = isL1Answer ? exerciseBookmark.to : exerciseBookmark.from;

  const solutionWordCount = getExpressionlength(solutionText);
  const isWrongOrder = isIncorrect && correctWordCountInInput === solutionWordCount;

  const isPartOfExpressionCorrect = correctWordCountInInput >= 1 && solutionWordCount > 1 && isIncorrect;

  const answerLanguageCode = isL1Answer ? exerciseBookmark.to_lang : exerciseBookmark.from_lang;

  const inputLanguageName = LANGUAGE_CODE_TO_NAME[answerLanguageCode];
  const showVirtualKeyboard = needsVirtualKeyboard(answerLanguageCode, userDetails?.id);
  const suppressOSKeyboard = showVirtualKeyboard && !isKeyboardCollapsed;

  // Blur input when virtual keyboard is shown to hide native keyboard
  useEffect(() => {
    if (showVirtualKeyboard && !isKeyboardCollapsed && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isKeyboardCollapsed, showVirtualKeyboard]);

  function handleHint() {
    setUsedHint(true);
    let hint;
    const lowerCurrentInput = currentInput.toLowerCase();
    const lowerTargetWord = solutionText.toLowerCase();
    if (lowerCurrentInput === lowerTargetWord.substring(0, lowerCurrentInput.length)) {
      hint = solutionText.substring(0, currentInput.length + 1);
    } else {
      hint = solutionText.substring(0, 1);
    }
    setCurrentInput(hint);
    notifyOfUserAttempt(HINT, exerciseBookmark);
  }

  // Update the feedback message
  useEffect(() => {
    if (isInputWrongLanguage) {
      setFeedbackMessage("Correct, but wrong language 😉");
      return;
    }

    if (distanceToCorrect < 5 && distanceToCorrect > 2 && !isWrongOrder) {
      setFeedbackMessage(`❌ Not quite the ${Pluralize.wordExpression(solutionWordCount)}`);
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
      else setFeedbackMessage(`⭐ You got ${correctWordCountInInput}/${solutionWordCount} words correct`);
      return;
    }
    setFeedbackMessage("");
    // eslint-disable-next-line
  }, [distanceToCorrect, isSameLengthAsSolution, isLongerThanSolution, isInputWrongLanguage]);

  // Check if current input is correct (for auto-submission)
  function checkIfCorrect(input) {
    if (input === "") return false;

    let normalizedInput = normalizeAnswer(input);
    let normalizedAnswer = normalizeAnswer(solutionText);

    // Auto-submit only for perfect matches - no typo tolerance
    return normalizedInput === normalizedAnswer;
  }

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
      handleCorrectAnswer(exerciseBookmark);
      setIsCorrect(true);
      setIsIncorrect(false);
      return;
    }
    let totalWordsCorrect = countCommonWords(normalizedInput, normalizedAnswer);

    setCorrectWordCountInInput(totalWordsCorrect);
    setDistanceToCorrect(levDistance);
    setIsLongerThanSolution(normalizedInput.length > normalizedAnswer.length);
    setIsSameLengthAsSolution(normalizedInput.length === normalizedAnswer.length);

    let updatedMessageToAPI;
    let userUsedWrongLang = isL1Answer && normalizedInput === normalizedLearningWord;
    setIsInputWrongLanguage(userUsedWrongLang);

    if (userUsedWrongLang) {
      // If the user writes in the wrong language
      // we give them a Hint, mainly for audio exercises.
      updatedMessageToAPI = HINT;
      setDistanceToCorrect();
    } else if (totalWordsCorrect >= 1 && solutionWordCount > 1) {
      updatedMessageToAPI = HINT;
    } else if (levDistance === 1) {
      // The user almost got it correct
      // we associate it with a H
      updatedMessageToAPI = HINT;
    } else {
      updatedMessageToAPI = WRONG;
      handleIncorrectAnswer(exerciseBookmark);
    }
    notifyOfUserAttempt(updatedMessageToAPI, exerciseBookmark);
    setIsIncorrect(true);
  }

  const InputField = isIncorrect ? s.AnimatedInput : s.Input;
  return (
    <>
      <div style={{ marginTop: "3em", marginBottom: "1em" }}>
        {/* Input field - centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1em",
            width: "100%",
          }}
        >
          <div className="type-feedback">{feedbackMessage !== "" && <p>{feedbackMessage}</p>}</div>
          <InputField
            ref={inputRef}
            type="text"
            readOnly={suppressOSKeyboard}
            placeholder={"Type in " + inputLanguageName}
            className={distanceToCorrect >= 5 && correctWordCountInInput === 0 ? "wrong-border" : "almost-border"}
            value={currentInput}
            onChange={(e) => {
              const newValue = e.target.value;
              setCurrentInput(newValue);

              // Auto-submit if the answer is correct
              if (checkIfCorrect(newValue)) {
                setTimeout(() => {
                  handleCorrectAnswer(exerciseBookmark);
                  setIsCorrect(true);
                  setIsIncorrect(false);
                }, 200); // Small delay to show the typed word
              }
            }}
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
              width: "100%",
              maxWidth: "300px",
            }}
          />
        </div>

        {/* Buttons - side by side on all screen sizes */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1em",
            flexWrap: "wrap",
          }}
        >
          <s.LeftFeedbackButton onClick={() => handleHint()} disabled={usedHint}>
            {strings.hint}
          </s.LeftFeedbackButton>
          <s.RightFeedbackButton onClick={checkResult}>{strings.check}</s.RightFeedbackButton>
        </div>

        {/* Virtual Keyboard - shown for non-Roman alphabets */}
        {showVirtualKeyboard && (
          <VirtualKeyboard
            languageCode={answerLanguageCode}
            onInput={setCurrentInput}
            currentValue={currentInput}
            initialCollapsed={false}
            onCollapsedChange={setIsKeyboardCollapsed}
          />
        )}
      </div>
    </>
  );
}
