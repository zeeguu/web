import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import OrderWordsInput from "./OrderWordsInput.js";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import removePunctuation from "../../../assorted/removePunctuation";

const EXERCISE_TYPE = "OrderWords_L2T_from_L1T";

export default function OrderWords({
  api,
  bookmarksToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
  toggleShow,
  reload,
  setReload,
}) {
  const [initialTime] = useState(new Date());
  //const [buttonOptions, setButtonOptions] = useState(null);
  const [wordsMasterStatus, setWordsMasterStatus] = useState([]);
  const [messageToAPI, setMessageToAPI] = useState("");
  const [exerciseLang, setExerciseLang] = useState(bookmarksToStudy[0].from_lang);
  const [clueText, setClueText] = useState(["Clues go here."]);
  const [translatedText, setTranslatedText] = useState();
  const [originalText, setOriginalText] = useState("");
  const [hasClues, setHasClues] = useState(false);
  const [constructorWordArray, setConstructorWordArray] = useState([]);
  const [confuseWords, setConfuseWords] = useState();
  const [wordSwapId, setwordSwapId] = useState(-1);
  const [wordSwapStatus, setWordSwapStatus] = useState("");
  const [solutionWords, setSolutionWords] = useState([]);
  const [resetConfirmDiv, setResetConfirmDiv] = useState(false);

  console.log("Running ORDER WORDS EXERCISE")
  console.log("Context: " + bookmarksToStudy[0].context.split(" ").length + ", " + bookmarksToStudy[0].context)
  console.log(constructorWordArray);
  console.log(bookmarksToStudy);
  function getWordsInArticle(sentence) {
    return removePunctuation(sentence).split(" ")
  }

  function setWordAttributes(word_list) {
    // Create an Word Object, that contains the 
    // id, word, status (Correct, Incorrect, Feedback), inUse (true/false)
    // To keep punctuation at the spaCy pipeline, we simply hide it from the UI, but
    // 
    let arrayWords = []
    for (let i = 0; i < word_list.length; i++) {
      arrayWords.push({
        "id": i,
        "word": word_list[i],
        "status": "",
        "inUse": false,
        "feedback": "",
      })
    }
    return arrayWords
  }

  useEffect(() => {
    console.log("Getting Translation");
    resetStatus();
    const initialWords = getWordsInArticle(bookmarksToStudy[0].context)
    setSolutionWords(setWordAttributes([...initialWords]));
    setOriginalText(bookmarksToStudy[0].context);
    api
      .basicTranlsate(
        bookmarksToStudy[0].from_lang,
        localStorage.native_language,
        bookmarksToStudy[0].context
      )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setTranslatedText(data["translation"])
      })
      .catch(() => {
        setTranslatedText("error");
        console.log("could not retreive translation");
      });
    console.log("GETTING WORDS");
    console.log(bookmarksToStudy[0].from_lang);
    api.getConfusionWords(exerciseLang, bookmarksToStudy[0].context, (cWords) => {
      let apiConfuseWords = JSON.parse(cWords)
      let exerciseWords = [...initialWords].concat(apiConfuseWords);
      console.log(apiConfuseWords);
      console.log("Exercise Words");
      console.log(exerciseWords);
      setConfuseWords(apiConfuseWords);
      exerciseWords = shuffle(exerciseWords);
      let propWords = setWordAttributes(exerciseWords);
      setWordsMasterStatus(propWords);
      setConfuseWords(apiConfuseWords);
    });
  }, [bookmarksToStudy])

  function getWordById(id, list) {
    let wordProps = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        wordProps = list[i];
        break;
      }
    }
    return wordProps;
  }

  function notifyChoiceSelection(selectedChoice, inUse) {
    undoResetStatus();
    if (isCorrect) return // Avoid swapping Words when it is correct.
    // Create objects to update.
    let updatedMasterStatus = [...wordsMasterStatus]
    let newConstructorWordArray = [...constructorWordArray]

    let wordSelected = getWordById(selectedChoice, updatedMasterStatus)

    if (inUse && (wordSwapId === -1)) {
      // Select the Word for Swapping. 
      // Set the Color to Blue
      setwordSwapId(selectedChoice)
      console.log(selectedChoice);
      console.log("Selected: " + wordSwapId);
      setWordSwapStatus(wordSelected.status);
      let wordInOrder = getWordById(wordSwapId, newConstructorWordArray)

      wordSelected.status = "toSwap"
      wordInOrder.status = "toSwap"

      setWordsMasterStatus(updatedMasterStatus);
      setConstructorWordArray(newConstructorWordArray);
      return
    }

    // Handle the case where we swap a selected word.
    if (wordSwapId !== -1 && selectedChoice !== wordSwapId) {
      console.log("Swapping words!")
      // Update the Word to have the previous status
      let wordInSwapStatus = getWordById(wordSwapId, newConstructorWordArray)
      wordInSwapStatus = { ...wordInSwapStatus }
      wordInSwapStatus.status = wordSwapStatus;
      setWordSwapStatus("");

      // If the word was not in use,
      // we need to toggle the flag.
      if (wordInSwapStatus.inUse !== wordSelected.inUse) {
        wordInSwapStatus.inUse = !wordInSwapStatus.inUse;
      }

      // Handle case where both words are in the same array.
      for (let i = 0; i < newConstructorWordArray.length; i++) {
        if (newConstructorWordArray[i].id === wordSwapId) {
          if (!wordSelected.inUse) { wordSelected.inUse = true }
          newConstructorWordArray[i] = wordSelected
        }
        else if (newConstructorWordArray[i].id === selectedChoice) {
          newConstructorWordArray[i] = wordInSwapStatus
        }
      }

      // wordsMasterStatus index match the id in words.
      updatedMasterStatus[wordSwapId] = wordInSwapStatus

      // Update all the statuses.
      setWordsMasterStatus(updatedMasterStatus);
      setConstructorWordArray(newConstructorWordArray);
      setwordSwapId(-1)
      return
    }
    // Add the Word to the Constructor
    if (!wordSelected.inUse) {
      newConstructorWordArray.push(wordSelected)
    }
    else {
      newConstructorWordArray = newConstructorWordArray.filter((wordElement) => wordElement.id !== wordSelected.id)
    }
    wordSelected.inUse = !wordSelected.inUse
    // If there was a selected word, we return it to the previous state.
    console.log("COMPARING STATUS: " + wordSelected.status)
    if (wordSelected.status === "toSwap") {
      wordSelected.status = wordSwapStatus;
      setWordSwapStatus("");
    }
    console.log("AFTER COMPARING STATUS: " + wordSelected.status)
    setwordSwapId(-1)
    setWordsMasterStatus(updatedMasterStatus)
    setConstructorWordArray(newConstructorWordArray);
  }

  function handleShowSolution() {
    // Ensure Rest and Swap are reset
    undoResetStatus();
    handleUndoSelection();

    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    let duration = pressTime - initialTime;
    let message = messageToAPI + "S";
    // Construct the Sentence to show the solution.
    let solutionWord = [...solutionWords]
    for (let i = 0; i < solutionWords.length; i++) {
      solutionWord[i].status = "correct"
    }
    setConstructorWordArray(solutionWord);
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setHasClues(false);
    handleAnswer(message, duration);
  }

  function handleAnswer(message) {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");

    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      pressTime - initialTime,
      bookmarksToStudy[0].id
    );
  }

  function resetStatus() {
    handleUndoSelection();
    let resetWords = [...wordsMasterStatus]
    for (let i = 0; i < resetWords.length; i++) {
      resetWords[i].inUse = false;
    }
    console.log(resetWords);
    setConstructorWordArray([]);
    setIsCorrect(false);
    setWordsMasterStatus(resetWords);
    undoResetStatus();
  }
  function handleReset() {
    if (constructorWordArray.length > 0) {
      setResetConfirmDiv(true);
    }

  }

  function undoResetStatus() {
    setResetConfirmDiv(false);
  }

  function setAllInWordsStatus(status) {
    // Aligns all the status to be the same.
    let updatedWords = [...wordsMasterStatus]
    let inUseIds = [...constructorWordArray].map(word => word.id)
    console.log(inUseIds)
    for (let i = 0; i < updatedWords.length; i++) {
      if (inUseIds.includes(updatedWords[i].id)) {
        updatedWords[i].status = status
      }
    }
    setWordsMasterStatus(updatedWords)

    let newConstructorWordArray = [...constructorWordArray]
    for (let i = 0; i < newConstructorWordArray.length; i++) {
      if (inUseIds.includes(newConstructorWordArray[i].id)) {
        newConstructorWordArray[i].status = status
      }
    }
    setConstructorWordArray(newConstructorWordArray)
  }

  function resetSwapWordStatus() {
    setWordSwapStatus("")
    setwordSwapId(-1)
  }

  function handleUndoSelection() {

    let newConstructorWordArray = [...constructorWordArray];
    let newWordMasterStatus = [...wordsMasterStatus];

    let inOrderWord = getWordById(wordSwapId, newConstructorWordArray);
    let wordMastStatus = getWordById(wordSwapId, newWordMasterStatus);

    // Set to previous state
    inOrderWord.status = wordSwapStatus;
    wordMastStatus.status = wordSwapStatus;

    resetSwapWordStatus();
    setConstructorWordArray(newConstructorWordArray);
    setWordsMasterStatus(newWordMasterStatus);
  }


  function handleCheck() {
    resetSwapWordStatus();
    // Do nothing if empty
    if (constructorWordArray.length === 0) {
      //setHasClues(true);
      //setClueText(["You have not added any words."]);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
      return
    }

    // Check if the solution is already the same
    let filterPunctuationOGText = removePunctuation(originalText)

    let constructedSentence = []
    for (let i = 0; i < constructorWordArray.length; i++) {
      constructedSentence.push(constructorWordArray[i].word);
    }

    // Get the Sentence
    constructedSentence = constructedSentence.join(" ")
    if (constructedSentence === filterPunctuationOGText) {
      setHasClues(false);
      setIsCorrect(true);
      setAllInWordsStatus("correct");
    }
    else {
      // Handle the Errors and Set the feedback
      // API should return the status, then update the MasterStatus
      console.log("Sentence incorrect!");

      // We need to ensure that we don't send the entire sentence,
      // or alignment might align very distant words.
      let resizeSol = "" + filterPunctuationOGText
      resizeSol = resizeSol.split(" ")
      resizeSol = resizeSol.slice(0, constructorWordArray.length + 1).join(" ")
      api.annotateClues(constructorWordArray, resizeSol, exerciseLang, (updatedMasterStatus) => {
        let updatedWordStatus = JSON.parse(updatedMasterStatus);
        let cluesText = [];
        let copy_props = [...updatedWordStatus];
        console.log(updatedWordStatus);
        let newWordMasterStatus = [...wordsMasterStatus];
        for (let i = 0; i < copy_props.length; i++) {
          let wordProp = copy_props[i];
          newWordMasterStatus[wordProp.id] = wordProp;
          if (wordProp.feedback != "" && !wordProp.isCorrect) { cluesText.push(wordProp.feedback) };
        }
        console.log(cluesText);
        if (cluesText.length > 0) { setHasClues(true); }
        if (cluesText.length < 2) {
          setClueText(cluesText.slice(0, 2));
        }
        else {
          setClueText(cluesText.slice(0, 2).concat(["Only the first 2 errors are shown."]));
        }
        setConstructorWordArray(updatedWordStatus);
        setWordsMasterStatus(newWordMasterStatus);
      }
      );

      //setAllInWordsStatus("incorrect");

    }
  }

  if (wordsMasterStatus.length == 0 && !confuseWords) {
    console.log("Running load animation.")
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="orderWords">

      <div className="headlineOrderWords">
        {strings.orderTheWordsToMakeTheFollowingSentence}
        <h2>{translatedText}</h2>
      </div>
      {hasClues && (
        <s.ItemRowCompactWrap className="cluesRow">
          <h4>Clues</h4>
          {clueText.length > 0 && clueText.map(clue => <p key={clue}>{clue}</p>)}
        </s.ItemRowCompactWrap>
      )}

      {(constructorWordArray.length > 0 || !isCorrect) && (
        <div className={`orderWordsItem ${wordSwapId !== -1 ? 'select' : ''}`}>
          <OrderWordsInput
            buttonOptions={constructorWordArray}
            notifyChoiceSelection={notifyChoiceSelection}
            incorrectAnswer={isCorrect}
            setIncorrectAnswer={setIsCorrect}
            handleShowSolution={handleShowSolution}
            toggleShow={toggleShow}
            isWordSoup={false}
          />
        </div>
      )}

      {isCorrect && <div>
        <h4>{strings.orderWordsCorrectMessage}</h4>
        <p>{originalText}</p>
      </div>}
      {wordsMasterStatus.length == 0 && <LoadingAnimation />}
      {!isCorrect && (
        <OrderWordsInput
          buttonOptions={wordsMasterStatus}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={isCorrect}
          setIncorrectAnswer={setIsCorrect}
          handleShowSolution={handleShowSolution}
          toggleShow={toggleShow}
          isWordSoup={true}
        />
      )}

      {!isCorrect && (
        <s.ItemRowCompactWrap className="ItemRowCompactWrap">
          <button onClick={handleReset} className={constructorWordArray.length > 0 ? "owButton undo" : "owButton disable"}>↻ {strings.reset}</button>
          <button onClick={handleCheck} className={constructorWordArray.length > 0 ? "owButton check" : "owButton disable"}>{strings.check} ✔</button>
        </s.ItemRowCompactWrap>
      )}
      {(wordSwapId !== -1) && (!resetConfirmDiv) && (
        <div className="swapModeBar">
          <button onClick={handleUndoSelection} className="owButton undo">{strings.undo}</button>
          <p>{strings.swapInfo}</p>
        </div>
      )
      }
      {(resetConfirmDiv) && (
        <div className="resetConfirmBar">
          <button onClick={undoResetStatus} className="owButton undo">{strings.undo}</button>
          <p>{strings.corfirmReset}</p>
          <button onClick={resetStatus} className="owButton check">{strings.confirm}</button>
        </div>
      )
      }
      {isCorrect && (
        <NextNavigation
          api={api}
          // Added an empty bookmark to avoid showing the
          // Listen Button.
          bookmarksToStudy={bookmarksToStudy}
          moveToNextExercise={moveToNextExercise}
          reload={reload}
          setReload={setReload}
        />
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
      {!isCorrect && (<p className="tipText">{strings.orderWordsTipMessage}</p>)}
    </s.Exercise>
  );
}
