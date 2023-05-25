import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import * as sOW from "./ExerciseTypeOW.sc.js"
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
  const [initialTime, setInitialTime] = useState(new Date());
  //const [buttonOptions, setButtonOptions] = useState(null);
  const [resetCounter, setResetCounter] = useState(0);
  const [hintCounter, setHintCounter] = useState(0);
  const [totalErrorCounter, setTotalErrorCounter] = useState(0);
  const [posSelected, setPosSelected] = useState("");
  const [wordsMasterStatus, setWordsMasterStatus] = useState([]);
  const [messageToAPI] = useState("");
  const [exerciseLang] = useState(bookmarksToStudy[0].from_lang);
  const [exerciseContext, setExerciseContext] = useState("");
  const [clueText, setClueText] = useState([]);
  const [translatedText, setTranslatedText] = useState("");
  const [hasClues, setHasClues] = useState(false);
  const [constructorWordArray, setConstructorWordArray] = useState([]);
  const [confuseWords, setConfuseWords] = useState();
  const [wordForConfusion, setWordForConfuson] = useState();
  const [wordSwapId, setWordSwapId] = useState(-1);
  const [wordSwapStatus, setWordSwapStatus] = useState("");
  const [solutionWords, setSolutionWords] = useState([]);
  const [resetConfirmDiv, setResetConfirmDiv] = useState(false);
  const [sentenceWasTooLong, setSentenceWasTooLong] = useState(false);
  const handleLongSentences = false;

  console.log("Running ORDER WORDS EXERCISE")

  function resetReactStates() {
    setInitialTime(new Date());
    setResetCounter(0);
    setHintCounter(0);
    setTotalErrorCounter(0);
    setPosSelected("");
    setWordsMasterStatus([]);
    setExerciseContext("");
    setClueText([]);
    setTranslatedText("");
    setHasClues(false);
    setConstructorWordArray([]);
    setConfuseWords();
    setWordForConfuson();
    setWordSwapStatus("");
    setWordSwapId(-1);
    setSolutionWords([]);
    setResetConfirmDiv(false);
    setSentenceWasTooLong(false);
  }

  function removeEmptyTokens(tokenList) {
    // In some instance, there will be punctuation in the middle, which
    // results in trailing spaces. The loop below ensures those get removed.
    return tokenList.filter((token) => token !== "")
  }

  function getWordsInArticle(sentence) {
    let wordsForExercise = removePunctuation(sentence).split(" ")
    return removeEmptyTokens(wordsForExercise)
  }

  function setWordAttributes(word_list) {
    // Create an Word Object, that contains the 
    // id, word, status (Correct, Incorrect, Feedback), inUse (true/false)
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

  function orderWordsLogUserActivity(eventType, jsonData){
    console.log("LOG EVENT, type: " + eventType);
    console.log(jsonData);
    api.logUserActivity(
      eventType,
      "",
      bookmarksToStudy[0].id,
      JSON.stringify(jsonData)
    );
  }

  function createConfusionWords(contextToUse, translatedContext, sentenceTooLong) {
    const initialWords = getWordsInArticle(contextToUse);
    setSolutionWords(setWordAttributes([...initialWords]));
    console.log("Info: Getting Confusion Words");
    console.log(bookmarksToStudy[0].from_lang);
    api.getConfusionWords(exerciseLang, contextToUse, (cWords) => {
      let jsonCWords = JSON.parse(cWords)
      let apiConfuseWords = jsonCWords["confusion_words"]
      let exerciseWords = [...initialWords].concat(apiConfuseWords);
      console.log(apiConfuseWords);
      console.log("Exercise Words");
      console.log(exerciseWords);
      exerciseWords = shuffle(exerciseWords);
      let propWords = setWordAttributes(exerciseWords);
      setWordsMasterStatus(propWords);
      setConfuseWords(apiConfuseWords);
      setPosSelected(jsonCWords["pos_picked"]);
      setWordForConfuson(jsonCWords["word_used"]);
      let jsonDataExerciseStart = {
        "sentence_was_too_long": sentenceTooLong,
        "translation": translatedContext,
        "context": contextToUse,
        "confusionWords": apiConfuseWords,
        "pos": jsonCWords["pos_picked"],
        "word_for_confusion": jsonCWords["word_used"],
        "total_words": exerciseWords.length,
        "bookmark": bookmarksToStudy[0].from,
        "exercise_start": initialTime,
      }
      orderWordsLogUserActivity("WO_START", jsonDataExerciseStart);
    });
  }

  function prepareExercise(contextToUse, sentenceTooLong) {
    console.log("CONTEXT: '" + contextToUse + "'");
    contextToUse = contextToUse.trim()
    console.log("CONTEXT AFTER TRIM: '" + contextToUse + "'");
    setExerciseContext(contextToUse);
    console.log("Getting Translation for ->" + contextToUse);
    api
      .basicTranlsate(
        exerciseLang,
        localStorage.native_language,
        contextToUse
      )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let translatedContext = data["translation"] + ".";
        setTranslatedText(translatedContext);
        createConfusionWords(contextToUse, translatedContext, sentenceTooLong);

      })
      .catch(() => {
        setTranslatedText("Error retrieving the translation.");
        console.log("could not retreive translation");
        setConfuseWords([]);
        setWordsMasterStatus([""]);
      });


  }

  useEffect(() => {
    let originalContext = bookmarksToStudy[0].context;
    let sentenceTooLong = false
    if (originalContext.split(" ").length > 15) {
      sentenceTooLong = true
    }
    resetReactStates();
    // Handle the case of long sentences, this relies on activating the functionality. 
    if (sentenceTooLong > 15 && handleLongSentences) {
      api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
        console.log(articleInfo);
        api.getWOsentences(articleInfo["content"], originalContext,
          exerciseLang, (candidateSents) => {
            console.log("SENTENCES THAT ARE GOOD FOR WO")
            console.log(candidateSents);
            let candidatesSent = JSON.parse(candidateSents)[0][1]
            console.log(candidatesSent);
            prepareExercise(candidatesSent, sentenceTooLong);
          });
      });
    }
    else {
      console.log("Using default context.");
      prepareExercise(bookmarksToStudy[0].context, sentenceTooLong);
    }
    setSentenceWasTooLong(sentenceTooLong);
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

    // Handle Case where Word is in ConstructorBox & No word is selected.
    if (inUse && (wordSwapId === -1)) {
      // Select the Word for Swapping. 
      // Set the Color to Blue
      setWordSwapId(selectedChoice)
      console.log(selectedChoice);
      console.log("Selected: " + wordSwapId);
      setWordSwapStatus(wordSelected.status);
      let wordInOrder = getWordById(wordSwapId, newConstructorWordArray)

      wordSelected.status = "toSwap"
      wordInOrder.status = "toSwap"

      setWordsMasterStatus(updatedMasterStatus);
      setConstructorWordArray(newConstructorWordArray);
      return;
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
      setWordSwapId(-1);
      return;
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
    setWordSwapId(-1)
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
    setWordsMasterStatus([]);
  }

  function handleAnswer(message) {
    let pressTime = new Date();
    let duration = pressTime - initialTime
    console.log(duration);
    console.log("^^^^ time elapsed");
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );

    let jsonDataExerciseEnd = {
      "sentence_was_too_long": sentenceWasTooLong,
      "outcome": message,
      "total_time": duration,
      "total_errors": totalErrorCounter,
      "total_hints": hintCounter,
      "total_resets": resetCounter,
      "translation": translatedText,
      "context": exerciseContext,
      "bookmark": bookmarksToStudy[0].from,
      "confusionWords": confuseWords,
      "pos": posSelected,
      "word_for_confusion": wordForConfusion,
      "exercise_start": initialTime,
    };
    orderWordsLogUserActivity("WO_END", jsonDataExerciseEnd);
  }

  function resetStatus() {
    if (resetConfirmDiv) {
      console.log("Run update counter.")
      setResetCounter(resetCounter + 1);
    }
    handleUndoSelection();
    let resetWords = [...wordsMasterStatus];
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
    let updatedWords = [...wordsMasterStatus];
    let inUseIds = [...constructorWordArray].map(word => word.id);
    console.log(inUseIds)
    for (let i = 0; i < updatedWords.length; i++) {
      if (inUseIds.includes(updatedWords[i].id)) {
        updatedWords[i].status = status;
      }
    }
    setWordsMasterStatus(updatedWords);

    let newConstructorWordArray = [...constructorWordArray];
    for (let i = 0; i < newConstructorWordArray.length; i++) {
      if (inUseIds.includes(newConstructorWordArray[i].id)) {
        newConstructorWordArray[i].status = status;
      }
    }
    setConstructorWordArray(newConstructorWordArray);
  }

  function resetSwapWordStatus() {
    setWordSwapStatus("");
    setWordSwapId(-1);
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

  function updateWordsFromAPI(updatedStatusFromAPI, resizeSol, constructedSentence) {
    // Variable to update and store in the user Activity.
    let updatedWordStatus = JSON.parse(updatedStatusFromAPI);
    let cluesTextList = [];
    let errorTypesList = [];
    let copyProps = [...updatedWordStatus];
    let newWordMasterStatus = [...wordsMasterStatus];
    let errorCount = 0;

    console.log(updatedWordStatus);
    for (let i = 0; i < copyProps.length; i++) {
      let wordProp = copyProps[i];
      newWordMasterStatus[wordProp.id] = wordProp;
      if (wordProp.feedback != "" && !wordProp.isCorrect) {
        cluesTextList.push(wordProp.feedback);
        errorTypesList.push(wordProp.error_type);
      };
      if (!wordProp.isCorrect) { errorCount++; }
    }
    let updatedErrorCounter = totalErrorCounter + errorCount
    setConstructorWordArray(updatedWordStatus);
    setWordsMasterStatus(newWordMasterStatus);
    setTotalErrorCounter(updatedErrorCounter);
    updateClueText(cluesTextList, errorCount)
    logUserActivityCheck(constructedSentence,
      resizeSol, errorCount, cluesTextList, errorTypesList, updatedErrorCounter);
    
  }
  function updateClueText(cluesTextList, errorCount) {
    console.log(cluesTextList);
    let finalClueText = [];

    if (errorCount > 0) { setHasClues(true); }
    if (errorCount <= 2) {
      finalClueText = cluesTextList.slice(0, 2);
    }
    else {
      finalClueText = cluesTextList.slice(0, 2).concat([strings.orderWordsOnlyTwoMessagesShown]);
    }
    setClueText(finalClueText);
    return finalClueText
  }

  function logUserActivityCheck(constructedSentence,
    resizeSol, errorCount, finalClueText, errorTypesList, updatedErrorCounter) {
    let jsonDataExerciseCheck = {
      "constructed_sent": constructedSentence,
      "solution_sent": resizeSol,
      "n_errors": errorCount,
      "feedback_given": finalClueText,
      "error_types": errorTypesList,
      "total_errors": updatedErrorCounter,
      "exercise_start": initialTime
    };
    orderWordsLogUserActivity("WO_CHECK", jsonDataExerciseCheck);
  }

  function handleCheck() {
    resetSwapWordStatus();
    setHintCounter(hintCounter + 1);
    // Do nothing if empty
    if (constructorWordArray.length === 0) { return; };

    // Check if the solution is already the same
    let filterPunctuationSolText = removePunctuation(exerciseContext);

    let constructedSentence = []
    for (let i = 0; i < constructorWordArray.length; i++) {
      constructedSentence.push(constructorWordArray[i].word);
    }

    // Get the Sentence
    constructedSentence = constructedSentence.join(" ")
    if (constructedSentence === filterPunctuationSolText) {
      setHasClues(false);
      setIsCorrect(true);
      setAllInWordsStatus("correct");
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
      // Need to reset MasterStatus, so when the new exercise is loaded, there are no words.
      // This happens when you don't change the exercise.
      setWordsMasterStatus([]);
    }
    else {
      // Handle the Errors and Set the feedback
      // API should return the status, then update the MasterStatus
      console.log("Sentence incorrect!");

      // We need to ensure that we don't send the entire sentence,
      // or alignment might align very distant words.
      let resizeSol = "" + filterPunctuationSolText
      resizeSol = resizeSol.split(" ")
      resizeSol = resizeSol.slice(0, constructorWordArray.length + 1).join(" ")
      api.annotateClues(constructorWordArray, resizeSol, exerciseLang, (updatedConstructedWords) => {
        updateWordsFromAPI(updatedConstructedWords, resizeSol, constructedSentence);
      }
      );
    }
  }

  // Handle the Loading screen while getting the test.
  if ((wordsMasterStatus.length === 0 | translatedText === "") && !isCorrect) {
    console.log("Running load animation.")
    return <LoadingAnimation />;
  }

  return (
    <sOW.ExerciseOW className="orderWords">
      {translatedText === "" && !isCorrect && <LoadingAnimation />}
      <div className="headlineOrderWords">
        {strings.orderTheWordsToMakeTheFollowingSentence}
        <h2>{translatedText}</h2>
      </div>
      {hasClues && (
        <sOW.ItemRowCompactWrap className="cluesRow">
          <h4>Clues</h4>
          {clueText.length > 0 && clueText.map(clue => <p key={clue}>{clue}</p>)}
        </sOW.ItemRowCompactWrap>
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
        <p>{exerciseContext}</p>
      </div>}
      {wordsMasterStatus.length === 0 && !isCorrect && <LoadingAnimation />}
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
        <sOW.ItemRowCompactWrap className="ItemRowCompactWrap">
          <button onClick={handleReset} 
            className={constructorWordArray.length > 0 ? "owButton undo" : "owButton disable"}>
              ↻ {strings.reset}
          </button>
          <button onClick={handleCheck} 
          className={constructorWordArray.length > 0 ? "owButton check" : "owButton disable"}>
            {solutionWords.length === constructorWordArray.length ? strings.check : strings.hint} ✔
          </button>
        </sOW.ItemRowCompactWrap>
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
    </sOW.ExerciseOW>
  );
}
