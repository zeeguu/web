import { useState, useEffect } from "react";
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

  const handleLongSentences = false;
  const exerciseLang = bookmarksToStudy[0].from_lang;
  const _NO_WORD_SELECTED_ID = -100

  const [initialTime, setInitialTime] = useState(new Date());
  //const [buttonOptions, setButtonOptions] = useState(null);
  const [resetCounter, setResetCounter] = useState(0);
  const [hintCounter, setHintCounter] = useState(0);
  const [totalErrorCounter, setTotalErrorCounter] = useState(0);
  const [wordsReferenceStatus, setWordsReferenceStatus] = useState([]);
  const [messageToAPI] = useState("");
  const [exerciseContext, setExerciseContext] = useState("");
  const [clueText, setClueText] = useState([]);
  const [translatedText, setTranslatedText] = useState("");
  const [hasClues, setHasClues] = useState(false);
  const [userSolutionWordArray, setUserSolutionWordArray] = useState([]);
  const [confuseWords, setConfuseWords] = useState();
  const [wordSelected, setWordSelected] = useState();
  const [posSelected, setPosSelected] = useState("");
  const [wordSwapId, setWordSwapId] = useState(_NO_WORD_SELECTED_ID);
  const [wordSwapStatus, setWordSwapStatus] = useState("");
  const [solutionWords, setSolutionWords] = useState([]);
  const [isResetConfirmVisible, setIsResetConfirmVisible] = useState(false);
  const [sentenceWasTooLong, setSentenceWasTooLong] = useState(false);

  console.log("Running ORDER WORDS EXERCISE")

  // Util Functions for the Component
  function _resetReactStates() {
    setInitialTime(new Date());
    setResetCounter(0);
    setHintCounter(0);
    setTotalErrorCounter(0);
    setPosSelected("");
    setWordsReferenceStatus([]);
    setExerciseContext("");
    setClueText([]);
    setTranslatedText("");
    setHasClues(false);
    setUserSolutionWordArray([]);
    setConfuseWords();
    setWordSelected();
    setWordSwapStatus("");
    setWordSwapId(_NO_WORD_SELECTED_ID);
    setSolutionWords([]);
    setIsResetConfirmVisible(false);
    setSentenceWasTooLong(false);
  }

  function _removeEmptyTokens(tokenList) {
    // In some instance, there will be punctuation in the middle, which
    // results in trailing spaces. The loop below ensures those get removed.
    return tokenList.filter((token) => token !== "")
  }

  function _getWordsInSentence(sentence) {
    let wordsForExercise = removePunctuation(sentence).split(" ")
    return _removeEmptyTokens(wordsForExercise)
  }

  function _getWordsFromWordProps(wordPropList){
    let wordList = []
    for(let i = 0; i < wordPropList.length; i++){
      wordList.push(wordPropList[i]["word"])
    }
    return wordList
  }

  function _initializeWordAttributes(wordList, sentenceWords) {
    /*
    Create an word object with the following attributes:
      To be set by the component:
      - id:int , position in the array
      - word:str, the token string
      - status:str, the class for the object (correct, incorrect, toSwap)
      - inUse:bool, if the user has used this word
      - isInSetence:bool, if it's part of the original sentence
        - NOTE, this is done by the frontend as the API may add repeated
        words, and we do not want to mark them not being part of the sentence.
      - hasPlaceholders:bool, if it has a placeholder token
      To be set by API:
      - feedback:str, clue associated with the error
      - missBefore:bool, if the missing token is before 
      - status (Correct, Incorrect, Feedback)
    */
    let arrayWordsProps = []
    for (let i = 0; i < wordList.length; i++) {
      let isInSetence = sentenceWords.includes(wordList[i]) ? true : false
      arrayWordsProps.push({
        "id": i,
        "word": wordList[i],
        "status": "",
        "inUse": false,
        "feedback": "",
        "missBefore": false,
        "isInSentence": isInSetence,
        "hasPlaceholders": false,
      })
    }
    return arrayWordsProps
  }

  function _orderWordsLogUserActivity(eventType, jsonData){
    console.log("LOG EVENT, type: " + eventType);
    console.log(jsonData);
    api.logUserActivity(
      eventType,
      "",
      bookmarksToStudy[0].id,
      JSON.stringify(jsonData)
    );
  }

  function _getCurrentExerciseTime(){
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    return pressTime - initialTime;
  }

  function _logUserActivityCheck(constructedSentence,
    resizeSol, errorCount, finalClueText, errorTypesList, updatedErrorCounter) {
    let currentDuration = _getCurrentExerciseTime();
    let jsonDataExerciseCheck = {
      "constructed_sent": constructedSentence,
      "solution_sent": resizeSol,
      "n_errors": errorCount,
      "feedback_given": finalClueText,
      "error_types": errorTypesList,
      "total_errors": updatedErrorCounter,
      "exercise_time": currentDuration,
      "exercise_start": initialTime
    };
    _orderWordsLogUserActivity("WO_CHECK", jsonDataExerciseCheck);
  }

  function _getWordById(id, list) {
    let wordProps = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        wordProps = list[i];
        break;
      }
    }
    return wordProps;
  }

  function _setAllInWordsStatus(array, status) {
    // Aligns all the status to be the same.
    for (let i = 0; i < array.length; i++) {
      array[i].status = status;
    }
    return array
  }

  function _constructPlaceholderWordProp(idToUse, symbol){
    let placeholderWProp = {
      "id" : idToUse,
      "word": symbol,
      "isPlaceholder": true,
      "inUse": true,
      "status": "placeholder incorrect",
    }
    return placeholderWProp
  }

  function _filterPlaceholders(constructedWordArray){
    let filterArray = constructedWordArray.filter((wordElement) => 
    wordElement.id < wordsReferenceStatus.length && wordElement.id  >= 0);
    for (let i = 0; i < filterArray.length; i++) { 
      let wordProp = filterArray[i]
      wordProp["hasPlaceholders"] = false
    }
    return filterArray
  }

  function _updateClueText(cluesTextList, errorCount) {
    console.log(cluesTextList);
    let finalClueText = [];

    if (errorCount > 0) { setHasClues(true); }
    if (errorCount <= 2) {
      finalClueText = cluesTextList.slice(0, 2);
    }
    else {
      finalClueText = cluesTextList.slice(0, 2).concat([strings.orderWordsOnlyTwoMessagesShown]);
    }
    return finalClueText
  }

  function _resetSwapWordStatus() {
    setWordSwapStatus("");
    setWordSwapId(_NO_WORD_SELECTED_ID);
  }

  // Exercise Functions / Setup / Handle Interactions
  
  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    let originalContext = bookmarksToStudy[0].context;
    let sentenceTooLong = false
    let newExerciseStartTime = new Date();
    if (originalContext.split(" ").length > 15) {
      sentenceTooLong = true
    }
    _resetReactStates();
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
            prepareExercise(candidatesSent, sentenceTooLong, newExerciseStartTime);
          });
      });
    }
    else {
      console.log("Using default context.");
      prepareExercise(bookmarksToStudy[0].context, sentenceTooLong, newExerciseStartTime);
    }
    // Ensure the exercise time is set to the same that was used 
    // to prepare the exercise, as well as the sentenceTooLong.
    setInitialTime(newExerciseStartTime);
    setSentenceWasTooLong(sentenceTooLong);
  }, [bookmarksToStudy])

  function prepareExercise(contextToUse, sentenceTooLong, startTime) {
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
        let translatedContext = data["translation"];
        setTranslatedText(translatedContext);
        createConfusionWords(contextToUse, translatedContext, sentenceTooLong, startTime);

      })
      .catch(() => {
        let translationError = "Error retrieving the translation.";
        setTranslatedText(translationError);
        console.log("could not retreive translation");
        setConfuseWords([]);
        setWordsReferenceStatus([""]);
        let jsonDataExerciseStart = {
          "error": translationError,
          "bookmark": bookmarksToStudy[0].from,
          "exercise_start": startTime,
        }
        _orderWordsLogUserActivity("WO_START", jsonDataExerciseStart);
      });
  }

  function createConfusionWords(
    contextToUse, 
    translatedContext, 
    sentenceTooLong, 
    startTime) 
  {
    const initialWords = _getWordsInSentence(contextToUse);
    setSolutionWords(_initializeWordAttributes([...initialWords], initialWords));
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
      let propWords = _initializeWordAttributes(exerciseWords, initialWords);
      setWordsReferenceStatus(propWords);
      setConfuseWords(apiConfuseWords);
      setPosSelected(jsonCWords["pos_picked"]);
      setWordSelected(jsonCWords["word_used"]);
      let jsonDataExerciseStart = {
        "sentence_was_too_long": sentenceTooLong,
        "translation": translatedContext,
        "context": contextToUse,
        "confusionWords": apiConfuseWords,
        "pos": jsonCWords["pos_picked"],
        "word_for_confusion": jsonCWords["word_used"],
        "total_words": exerciseWords.length,
        "bookmark": bookmarksToStudy[0].from,
        "exercise_start": startTime,
      }
      _orderWordsLogUserActivity("WO_START", jsonDataExerciseStart);
    });
  }

  function notifyChoiceSelection(selectedChoice, inUse) {
    handleUndoResetStatus();
    // Avoid swapping Words when the exercise isCorrect.
    // this means we have finished the exercise.
    if (isCorrect) { return } 
    // Create objects to update.
    let updatedReferenceStatus = [...wordsReferenceStatus];
    let newUserSolutionWordArray = [...userSolutionWordArray];

    let wordSelected = _getWordById(selectedChoice, updatedReferenceStatus);

    // It's a placeholder token. (negative Ids)
    if (selectedChoice < 0){
      // Don't do anything if the user selects the same
      // placeholder token
      if ( wordSwapId === selectedChoice ) { return }
      // The placeholder tokens are not in the MasterStatus.
      wordSelected = _getWordById(selectedChoice, newUserSolutionWordArray)
    }

    // Handle Case where Word is in SolutionWordArray 
    // & No word is selected.
    if (inUse && (wordSwapId === _NO_WORD_SELECTED_ID)) {
      // Select the Word for Swapping. 
      // Set the Color to Blue
      console.log("Word Swap Id: " + wordSwapId);
      console.log("Selected Choice: " + selectedChoice);
      // Save the previous status.
      setWordSwapStatus(wordSelected.status);

      wordSelected.status = "toSwap";

      console.log(updatedReferenceStatus);
      setWordSwapId(selectedChoice);
      setWordsReferenceStatus(updatedReferenceStatus);
      setUserSolutionWordArray(newUserSolutionWordArray);
      return;
    }

    // Handle the case where we swap a selected word.
    if (wordSwapId !== _NO_WORD_SELECTED_ID && selectedChoice !== wordSwapId ) {
      console.log("Swapping words!")
      console.log("Word Swap Id: " + wordSwapId);
      console.log("Selected Choice: " + selectedChoice);
      // Update the Word to have the previous status
      let wordInSwapStatus = _getWordById(wordSwapId, newUserSolutionWordArray)
      wordInSwapStatus = { ...wordInSwapStatus }
      wordInSwapStatus.status = wordSwapStatus;
      setWordSwapStatus("");

      // If the word was not in use,
      // we need to toggle the flag.
      if (wordInSwapStatus.inUse !== wordSelected.inUse) {
        wordInSwapStatus.inUse = !wordInSwapStatus.inUse;
      }

      // Handle case where both words are in the same array.
      for (let i = 0; i < newUserSolutionWordArray.length; i++) {
        if (newUserSolutionWordArray[i].id === wordSwapId) {
          if (!wordSelected.inUse) { wordSelected.inUse = true }
          newUserSolutionWordArray[i] = wordSelected;
        }
        else if (newUserSolutionWordArray[i].id === selectedChoice) {
          newUserSolutionWordArray[i] = wordInSwapStatus;
        }
      }
      console.log(newUserSolutionWordArray);
      // wordReferenceStatus index match the id in words.
      updatedReferenceStatus[wordSwapId] = wordInSwapStatus;
      if (wordSwapId < 0 && selectedChoice >= 0){
        // We are swapping a placeholder token for a word.
        newUserSolutionWordArray = _filterPlaceholders(newUserSolutionWordArray);
      }
      // Update all the statuses.
      setWordsReferenceStatus(updatedReferenceStatus);
      setUserSolutionWordArray(newUserSolutionWordArray);
      setWordSwapId(_NO_WORD_SELECTED_ID);
      return;
    }

    // Add the Word to the userSolutionArea
    if (!wordSelected.inUse) {
      newUserSolutionWordArray.push(wordSelected);
    }
    else {
      newUserSolutionWordArray = newUserSolutionWordArray.filter((wordElement) => 
        wordElement.id !== wordSelected.id);
    }
    // Toggle the inUse flag
    wordSelected.inUse = !wordSelected.inUse;
    
    // If there was a selected word, we return it to the previous state.
    if (wordSelected.status === "toSwap") {
      wordSelected.status = wordSwapStatus;
      setWordSwapStatus("");
    }
    newUserSolutionWordArray = _filterPlaceholders(newUserSolutionWordArray);

    setWordSwapId(_NO_WORD_SELECTED_ID);
    setWordsReferenceStatus(updatedReferenceStatus);
    setUserSolutionWordArray(newUserSolutionWordArray);
  }

  function handleShowSolution() {
    // Ensure Rest and Swap are reset
    handleUndoResetStatus();
    handleUndoSelection();

    let duration = _getCurrentExerciseTime();
    let message = messageToAPI + "S";
    // Construct the Sentence to show the solution.
    let solutionWord = [...solutionWords]
    _setAllInWordsStatus(solutionWord, "correct");
    setUserSolutionWordArray(solutionWord);
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setHasClues(false);
    handleAnswer(message, duration);
    setWordsReferenceStatus([]);
  }

  function handleAnswer(message) {
    let duration = _getCurrentExerciseTime();
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
      "word_for_confusion": wordSelected,
      "exercise_start": initialTime,
    };
    _orderWordsLogUserActivity("WO_END", jsonDataExerciseEnd);
  }

  function handleResetClick() {
    // Don't allow the user to click rest if no words
    // are in the userSolutionArray
    if (userSolutionWordArray.length == 0) { return }
    setIsResetConfirmVisible(true);
  }

  function handleResetConfirm() {
    // Remove all the words from the user
    // solution word array.
    if (isResetConfirmVisible) {
      console.log("Run update counter.");
      setResetCounter(resetCounter + 1);
    }
    handleUndoSelection();
    let resetWords = [...wordsReferenceStatus];
    for (let i = 0; i < resetWords.length; i++) {
      resetWords[i].inUse = false;
    }
    console.log(resetWords);
    setUserSolutionWordArray([]);
    setIsCorrect(false);
    setWordsReferenceStatus(resetWords);
    handleUndoResetStatus();
  }

  function handleUndoResetStatus() {
    setIsResetConfirmVisible(false);
  }

  function handleUndoSelection() {

    let newUserSolutionWordArray = [...userSolutionWordArray];
    let newWordsReferenceStatus = [...wordsReferenceStatus];

    let selectedUserSolutionWord = _getWordById(wordSwapId, newUserSolutionWordArray);
    let selectedReferenceWord = _getWordById(wordSwapId, newWordsReferenceStatus);

    // Set to previous state
    selectedUserSolutionWord.status = wordSwapStatus;
    selectedReferenceWord.status = wordSwapStatus;

    _resetSwapWordStatus();
    setUserSolutionWordArray(newUserSolutionWordArray);
    setWordsReferenceStatus(newWordsReferenceStatus);
  }

  function handleCheck() {
    // Do nothing if empty
    if (userSolutionWordArray.length === 0) { return }
    
    _resetSwapWordStatus();
    setHintCounter(hintCounter + 1);

    // Check if the solution is already the same
    let filterPunctuationSolArray = _getWordsFromWordProps(solutionWords);
    let newUserSolutionWordArray = _filterPlaceholders([...userSolutionWordArray]);
    
    // Get the Constructed Sentence
    let userSolutionSentence = _getWordsFromWordProps(newUserSolutionWordArray).join(" ");

    if (userSolutionSentence === filterPunctuationSolArray.join(" ")) {
      setHasClues(false);
      setIsCorrect(true);
      _setAllInWordsStatus(newUserSolutionWordArray, "correct");
      setUserSolutionWordArray(newUserSolutionWordArray);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
      // Need to reset MasterStatus, so when the new exercise is loaded, there are no words.
      // This happens when you don't change the exercise.
      setWordsReferenceStatus([]);
    }
    else {
      // We need to ensure that we don't send the entire sentence,
      // or alignment might align very distant words.
      // We provide only the context up to + 1 what the user has constructed.
      let resizedSolutionText = filterPunctuationSolArray.slice(0, newUserSolutionWordArray.length + 1).join(" ");
      api.annotateClues(newUserSolutionWordArray, resizedSolutionText, exerciseLang, (updatedUserSolutionWords) => {
        updateWordsFromAPI(updatedUserSolutionWords, resizedSolutionText, userSolutionSentence);
      }
      );
    }
  }

  function updateWordsFromAPI(updatedWordStatusFromAPI, resizeSol, constructedSentence) {
    // Variable to update and store in the user Activity.
    let updatedWordStatus = JSON.parse(updatedWordStatusFromAPI);
    let cluesTextList = [];
    let errorTypesList = [];
    let newWordsReferenceStatus = [...wordsReferenceStatus];
    let newUserSolutionWordArray = []
    let errorCount = 0;
    // Placeholders are negative in this exercise.
    let placeholderCounter = -1

    console.log(updatedWordStatus);
    for (let i = 0; i < updatedWordStatus.length; i++) {
      let wordWasPushed = false;
      let wordProp = updatedWordStatus[i];
      // Sync up the status. The IDs reflect the order of the tokens
      // in the wordReferenceStatus array.
      newWordsReferenceStatus[wordProp.id] = wordProp;

      if (wordProp.feedback !== "" && !wordProp.isCorrect) {
        cluesTextList.push(wordProp.feedback);
        errorTypesList.push(wordProp.error_type);
        if (wordProp.error_type.slice(0,2) === "M:" && !wordProp["hasPlaceholders"]){
          if (wordProp["missBefore"]) { 
            newUserSolutionWordArray.push(_constructPlaceholderWordProp(placeholderCounter--, "✎")); 
          }
          wordProp["hasPlaceholders"] = true;
          newUserSolutionWordArray.push(wordProp);
          if (!wordProp["missBefore"]){
            newUserSolutionWordArray.push(_constructPlaceholderWordProp(placeholderCounter--, "✎"));
          }
          wordWasPushed = true;
        }
        else{
          wordProp["hasPlaceholders"] = false;
        }
      };
      if (!wordProp.isCorrect) { errorCount++; }
      if (!wordWasPushed) { newUserSolutionWordArray.push(wordProp); }
    }
    console.log("After adding the placeholders.")
    console.log(newUserSolutionWordArray);
    let updatedErrorCounter = totalErrorCounter + errorCount
    let finalClueText = _updateClueText(cluesTextList, errorCount);
    setUserSolutionWordArray(newUserSolutionWordArray);
    setWordsReferenceStatus(newWordsReferenceStatus);
    setTotalErrorCounter(updatedErrorCounter);
    setClueText(finalClueText);
    _logUserActivityCheck(constructedSentence,
      resizeSol, errorCount, finalClueText, errorTypesList, updatedErrorCounter);
  }

  // Handle the Loading screen while getting the text.
  if ((wordsReferenceStatus.length === 0 | translatedText === "") && !isCorrect) {
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
          {clueText.length > 0 && clueText.map((clue, index) => <p key={index}>{clue}</p>)}
        </sOW.ItemRowCompactWrap>
      )}

      {(userSolutionWordArray.length > 0 || !isCorrect) && (
        <div className={`orderWordsItem ${wordSwapId !== _NO_WORD_SELECTED_ID ? 'select' : ''}`}>
          <OrderWordsInput
            buttonOptions={userSolutionWordArray}
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
      {wordsReferenceStatus.length === 0 && !isCorrect && <LoadingAnimation />}
      {!isCorrect && (
        <OrderWordsInput
          buttonOptions={wordsReferenceStatus}
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
          <button onClick={handleResetClick} 
            className={userSolutionWordArray.length > 0 ? "owButton undo" : "owButton disable"}>
              ↻ {strings.reset}
          </button>
          <button onClick={handleCheck} 
          className={userSolutionWordArray.length > 0 ? "owButton check" : "owButton disable"}>
            {solutionWords.length <= userSolutionWordArray.length ? strings.check : strings.hint} ✔
          </button>
        </sOW.ItemRowCompactWrap>
      )}
      {(wordSwapId !== _NO_WORD_SELECTED_ID) && (!isResetConfirmVisible) && (
        <div className="swapModeBar">
          <button onClick={handleUndoSelection} className="owButton undo">{strings.undo}</button>
          <p>{wordSwapId < _NO_WORD_SELECTED_ID ? strings.swapInfoPlaceholderToken : strings.swapInfo}</p>
        </div>
      )
      }
      {(isResetConfirmVisible) && (
        <div className="resetConfirmBar">
          <button onClick={handleUndoResetStatus} className="owButton undo">{strings.undo}</button>
          <p>{strings.corfirmReset}</p>
          <button onClick={handleResetConfirm} className="owButton check">{strings.confirm}</button>
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
