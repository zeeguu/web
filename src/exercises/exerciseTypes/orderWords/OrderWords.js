import { useState, useEffect, useRef } from "react";
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
  exerciseSessionId
}) {

  // Constants for Exercise
  const exerciseLang = bookmarksToStudy[0].from_lang;
  const NO_WORD_SELECTED_ID = -100;
  const MAX_CONTEXT_LENGTH = 15;
  const ENABLE_SHORTER_CONTEXT_BUTTON = false;
  const IS_DEBUG = true;

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
  const [userSolutionWordArray, setUserSolutionWordArray] = useState([]);
  const [confuseWords, setConfuseWords] = useState();
  const [wordSelected, setWordSelected] = useState();
  const [posSelected, setPosSelected] = useState("");
  const [solutionWords, setSolutionWords] = useState([]);
  const [isCluesRowVisible, setIsCluesRowVisible] = useState(false);
  const [isResetConfirmVisible, setIsResetConfirmVisible] = useState(false);
  const [isHandlingLongSentences, setIsHandlingLongSentences] = useState(true);
  const [isSentenceTooLong, setIsSentenceTooLong] = useState(false);
  const [textBeforeTranslatedText, setTextBeforeTranslatedText] = useState("");
  const [textAfterTranslatedText, setTextAfterTranslatedText] = useState("");

  const solutionDragItem = useRef();
  const solutionDragOverItem = useRef();
  const solutionDragStartStatus = useRef();
  const isDragPlacementLeft = useRef();
  const wordSoupDrag = useRef();

  function _getPosition(elem){
    // Found: https://stackoverflow.com/questions/9040768/getting-coordinates-of-objects-in-js

    var dims = {offsetLeft:0, offsetTop:0, width:elem.offsetWidth};

    do {
        dims.offsetLeft += elem.offsetLeft;
        dims.offsetTop += elem.offsetTop;
    }

    while (elem = elem.offsetParent);

    return dims;
  }

  function _getObjectSide(mouseCoord, object){
    // Returns 0 if the mouse is to the right or 
    // 1 if the mouse is to the left.
    let mouseX = mouseCoord[0]
    let mouseY = mouseCoord[1]
    let objectBoundingBox = _getPosition(object)
    let objectMidpoint = objectBoundingBox.offsetLeft + (objectBoundingBox.width / 2);
    return mouseX < objectMidpoint ? 0 : 1;
  }

  function _getCurrentExerciseTime() {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    return pressTime - initialTime;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
  // Touch events needs to be handled as well

  const dragStart = (e, position) => {
    const copyListItems = [...userSolutionWordArray];
    solutionDragStartStatus.current = copyListItems.map(w => w.status);
    wordSoupDrag.current = position;
    setUserSolutionWordArray(copyListItems);
  };

  const solutionDragStart = (e, position) => {
    const copyListItems = [...userSolutionWordArray];
    solutionDragStartStatus.current = copyListItems.map(w => w.status);
    solutionDragItem.current = position;
    copyListItems[position].status += " toDrag"
    solutionDragOverItem.current = position
    setUserSolutionWordArray(copyListItems);
  };

  const solutionDragOver = (e, position) => {
    // Insert a PlaceHolder token at the desired place it it isn't one
    if (position == solutionDragItem.current) { return }
    let copyListItems = [...userSolutionWordArray];
    let element = document.elementFromPoint(e.pageX, e.pageY);
    let mouseSide = _getObjectSide([e.clientX, e.clientY], element)
    if (mouseSide == 1) {
      copyListItems[position].status = solutionDragStartStatus.current[position] + " toDragRight"
    }
    else {
      copyListItems[position].status = solutionDragStartStatus.current[position] + " toDragLeft"
    }
    setUserSolutionWordArray(copyListItems);
    solutionDragOverItem.current = position;
    isDragPlacementLeft.current = mouseSide;
  };

  const solutionDragLeave = (e, position) => {
    if (position == solutionDragItem.current) { return }
    const copyListItems = [...userSolutionWordArray];
    copyListItems[position].status = solutionDragStartStatus.current[position]
    setUserSolutionWordArray(copyListItems);
    isDragPlacementLeft.current = false;
    solutionDragOverItem.current = null;
  };

  const wordSoupDrop = (e) => {
    if (wordSoupDrag.current){
      // Do nothing:
      wordSoupDrag.current = null;
    }
    if (solutionDragItem.current != null){
      let wordItem = userSolutionWordArray[solutionDragItem.current];
      notifyChoiceSelection(wordItem.id);
    }
    _resetDragStatuses();
  }
  function _resetDragStatuses(){
    wordSoupDrag.current = null;
    solutionDragItem.current = null;
    solutionDragOverItem.current = null;
    solutionDragStartStatus.current = null;
    isDragPlacementLeft.current = null;
  }

  const solutionDrop = (e) => {
    let dropLocation = document.elementFromPoint(e.pageX, e.pageY)
    // Create the array to be modified
    let copyUserSolutionWordArray = [...userSolutionWordArray];

    if (copyUserSolutionWordArray.length == 0 && wordSoupDrag.current != null){
      // We are adding a word from the word soup
      // call the method that handles adding words.
      notifyChoiceSelection(wordSoupDrag.current, false);
      _resetDragStatuses();
      return;
    }

    if (!dropLocation.draggable) {
      // We drop in a location where it's not possible to drop
      if (solutionDragOverItem.current != null){
        copyUserSolutionWordArray[solutionDragOverItem.current].status = solutionDragStartStatus.current[solutionDragOverItem.current]
      }
    }
    if (wordSoupDrag != null || solutionDragItem != null){
      // We are dragging and there are elements  
      let isDragOverPlaceholder = false;
      let dragOverId = null;
      // If there is an element dragged over, then we are going to
      // reset the status and place the item
      if (solutionDragOverItem.current != null){
        copyUserSolutionWordArray[solutionDragOverItem.current].status = solutionDragStartStatus.current[solutionDragOverItem.current]
        isDragOverPlaceholder = copyUserSolutionWordArray[solutionDragOverItem.current].isPlaceholder
        if (isDragOverPlaceholder){
          dragOverId = copyUserSolutionWordArray[solutionDragOverItem.current].id;
        }
      }

      if (solutionDragItem.current != null) {
        // If it is an element from the solution area, we need to sawp.
        let dragItemContent = copyUserSolutionWordArray[solutionDragItem.current];
        // If it's null then place it in the same place.
        if (solutionDragOverItem.current == null) solutionDragOverItem.current = solutionDragItem.current;
        copyUserSolutionWordArray[solutionDragItem.current].status = solutionDragStartStatus.current[solutionDragItem.current]
        copyUserSolutionWordArray.splice(solutionDragItem.current, 1);
        let isPositionAffected = solutionDragOverItem.current > solutionDragItem.current ? 1 : 0;
        if (isDragPlacementLeft.current === 1 ) copyUserSolutionWordArray.splice(solutionDragOverItem.current-isPositionAffected+1, 0, dragItemContent);
        else copyUserSolutionWordArray.splice(solutionDragOverItem.current-isPositionAffected, 0, dragItemContent);
      }

      else if (wordSoupDrag.current != null){
        // If it's an element from the word soup we add it to the solution
        // based on the order item.
        if (solutionDragOverItem.current != null)
        {
          console.log("Running Adding from Word Soup")
          let copyWordsReferenceStatus = [... wordsReferenceStatus]
          let elementToAdd = _getWordById(wordSoupDrag.current, copyWordsReferenceStatus)
          elementToAdd.inUse = true;
          if (isDragPlacementLeft.current === 1) copyUserSolutionWordArray.splice(solutionDragOverItem.current+1, 0, {...elementToAdd});
          else copyUserSolutionWordArray.splice(solutionDragOverItem.current, 0, {...elementToAdd});
          setWordsReferenceStatus(copyWordsReferenceStatus);
        }
        else{
          // Or we add it to the end.
          notifyChoiceSelection(wordSoupDrag.current, false);
          _resetDragStatuses();
          return;
        }
      }
      if (isDragOverPlaceholder) {
        // if it was a place holder we remove it from the solution box. 
        copyUserSolutionWordArray = copyUserSolutionWordArray.filter((word) => word.id !== dragOverId);
      }
      // Update the solution array.
      setUserSolutionWordArray(copyUserSolutionWordArray);
    }
    // Reset all drag statuses to null.
    _resetDragStatuses();
  };

  console.log("Running ORDER WORDS EXERCISE")

  function _removeEmptyTokens(tokenList) {
    // In some instance, there will be punctuation in the middle, which
    // results in trailing spaces. The loop below ensures those get removed.
    return tokenList.filter((token) => token !== "")
  }

  function _getWordsInSentence(sentence) {
    let wordsForExercise = removePunctuation(sentence).split(" ")
    return _removeEmptyTokens(wordsForExercise)
  }

  function _getWordsFromWordProps(wordPropList) {
    let wordList = []
    for (let i = 0; i < wordPropList.length; i++) {
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

  function _orderWordsLogUserActivity(eventType, jsonData) {
    console.log("LOG EVENT, type: " + eventType);
    console.log(jsonData);
    api.logUserActivity(
      eventType,
      "",
      bookmarksToStudy[0].id,
      JSON.stringify(jsonData)
    );
  }

  function _getCurrentExerciseTime() {
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

  function _constructPlaceholderWordProp(idToUse, symbol) {
    let placeholderWProp = {
      "id": idToUse,
      "word": symbol,
      "isPlaceholder": true,
      "inUse": true,
      "status": "placeholder incorrect",
    }
    return placeholderWProp
  }

  function _filterPlaceholders(constructedWordArray) {
    let filterArray = constructedWordArray.filter((wordElement) =>
      wordElement.id < wordsReferenceStatus.length && wordElement.id >= 0);
    for (let i = 0; i < filterArray.length; i++) {
      let wordProp = filterArray[i]
      wordProp["hasPlaceholders"] = false
    }
    return filterArray
  }

  function _updateClueText(cluesTextList, errorCount) {
    console.log(cluesTextList);
    let finalClueText = [];

    if (errorCount > 0) { setIsCluesRowVisible(true); }
    if (errorCount <= 2) {
      finalClueText = cluesTextList.slice(0, 2);
    }
    else {
      finalClueText = cluesTextList.slice(0, 2).concat([strings.orderWordsOnlyTwoMessagesShown]);
    }
    return finalClueText
  }

  function _get_exercise_start_variables() {
    let originalContext = bookmarksToStudy[0].context;
    let isCheckLongSentence = false;
    let newExerciseStartTime = new Date();
    if (originalContext.split(" ").length > 15) {
      isCheckLongSentence = true;
    }
    let exercise_start_data = {
      "originalBookmarkContext": originalContext,
      "bookmarkWord": bookmarksToStudy[0].from,
      "isLongSentence": isCheckLongSentence,
      "exerciseStartTime": newExerciseStartTime
    }
    return exercise_start_data
  }

  // Exercise Functions / Setup / Handle Interactions

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    let exerciseIntializeVariables = _get_exercise_start_variables()
    // Handle the case of long sentences, this relies on activating the functionality. 
    prepareContext(
      exerciseIntializeVariables["originalBookmarkContext"],
      exerciseIntializeVariables["bookmarkWord"],
      isHandlingLongSentences,
      exerciseIntializeVariables["isLongSentence"],
      exerciseIntializeVariables["exerciseStartTime"]);

    // Ensure the exercise time is set to the same that was used 
    // to prepare the exercise, as well as the sentenceTooLong.
    setInitialTime(exerciseIntializeVariables["exerciseStartTime"]);
    setIsSentenceTooLong(exerciseIntializeVariables["isLongSentence"]);
  }, [])

  function prepareContext(
    originalContext,
    bookmarkWord,
    isHandleLongSentences,
    isCurrentSentenceTooLong,
    exerciseStartTime) {
    console.log("Status of isHandle: " + isHandleLongSentences)
    console.log(isCurrentSentenceTooLong)
    if (isHandleLongSentences && isCurrentSentenceTooLong) {
      console.log("Getting smaller context.");
      api.getSmallerContext(originalContext, bookmarkWord,
        exerciseLang, MAX_CONTEXT_LENGTH, (apiCandidateSubSent) => {
          let shorterContext = JSON.parse(apiCandidateSubSent);
          prepareExercise(shorterContext, isCurrentSentenceTooLong, isHandleLongSentences, exerciseStartTime);
        });
    }
    else {
      console.log("Using default context.");
      prepareExercise(originalContext, isCurrentSentenceTooLong, isHandleLongSentences, exerciseStartTime);
    }
  }

  function prepareExercise(exerciseContext, isSentenceTooLong, isHandlingLongSentences, startTime) {
    console.log("CONTEXT: '" + exerciseContext + "'");
    exerciseContext = exerciseContext.trim();
    console.log("CONTEXT AFTER TRIM: '" + exerciseContext + "'");
    console.log("Getting Translation for ->" + exerciseContext);

    setExerciseContext(exerciseContext);

    let originalContext = bookmarksToStudy[0].context.trim();

    api
      .basicTranlsate(
        exerciseLang,
        localStorage.native_language,
        exerciseContext
      )
      .then((response) => response.json())
      .then((data) => {
        let translatedContext = data["translation"];
        // Line below is used for development with no API key (translatedContext is Null)
        if (!translatedContext) { translatedContext = exerciseContext; }
        if (exerciseContext.length < originalContext.length) {
          let startPos = originalContext.indexOf(exerciseContext);
          let contextLen = originalContext.length;
          let textBeforeContext = originalContext.slice(0, startPos);
          if (textBeforeContext[-1] !== " ") {
            textBeforeContext = textBeforeContext + " "
          }
          setTextBeforeTranslatedText(textBeforeContext);
          setTextAfterTranslatedText(originalContext.slice(startPos + exerciseContext.length, contextLen));
        }
        setTranslatedText(translatedContext);
        createConfusionWords(exerciseContext, translatedContext,
          isSentenceTooLong, isHandlingLongSentences, startTime);

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
    exerciseContext,
    translatedContext,
    isSentenceTooLong,
    isHandlingLongSentences,
    startTime) {
    const initialWords = _getWordsInSentence(exerciseContext);
    setSolutionWords(_initializeWordAttributes([...initialWords], initialWords));
    console.log("Info: Getting Confusion Words");
    console.log(bookmarksToStudy[0].from_lang);
    api.getConfusionWords(exerciseLang, exerciseContext, (cWords) => {
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
        "sentence_was_too_long": isSentenceTooLong,
        "sentence_context_was_reduced": isHandlingLongSentences,
        "translation": translatedContext,
        "exercise_context": exerciseContext,
        "bookmark_context": bookmarksToStudy[0].context,
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
    if (isCorrect || selectedChoice < 0) { return }
    // Create objects to update.
    let updatedReferenceStatus = [...wordsReferenceStatus];
    let newUserSolutionWordArray = [...userSolutionWordArray];

    let wordSelected = _getWordById(selectedChoice, updatedReferenceStatus);

    // Add the Word to the userSolutionArea
    if (!wordSelected.inUse) {
      newUserSolutionWordArray.push({ ...wordSelected });
      newUserSolutionWordArray[newUserSolutionWordArray.length - 1].inUse = !wordSelected.inUse
    }
    else {
      // In case the user selected the same word twice, we remove it.
      newUserSolutionWordArray = newUserSolutionWordArray.filter((wordElement) =>
        wordElement.id !== wordSelected.id);
    }
    // Toggle the inUse flag
    wordSelected.inUse = !wordSelected.inUse;

    // Remove the last placeholder token if a user adds a token
    // Leave all other placeholders.
    if (newUserSolutionWordArray.length > 2) {
      // Check if the previous token (before the one the user just added)
      // is a placeholder token
      let previousIdToken = newUserSolutionWordArray[newUserSolutionWordArray.length - 2].id;
      if (previousIdToken < 0) {
        // Is a placeholder token
        newUserSolutionWordArray = newUserSolutionWordArray.filter((word) => word.id !== previousIdToken);
      }
    }

    setWordsReferenceStatus(updatedReferenceStatus);
    setUserSolutionWordArray(newUserSolutionWordArray);
  }

  function handleShowSolution() {
    // Ensure Rest and Swap are reset
    handleUndoResetStatus();

    let duration = _getCurrentExerciseTime();
    let message = messageToAPI + "S";
    // Construct the Sentence to show the solution.
    let solutionWord = [...solutionWords]
    _setAllInWordsStatus(solutionWord, "correct");
    setUserSolutionWordArray(solutionWord);
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setIsCluesRowVisible(false);
    handleAnswer(message, duration);
  }

  function handleAnswer(message) {
    let duration = _getCurrentExerciseTime();
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id,
      exerciseSessionId
    );

    let jsonDataExerciseEnd = {
      "sentence_was_too_long": isSentenceTooLong,
      "sentence_context_was_reduced": isHandlingLongSentences,
      "outcome": message,
      "total_time": duration,
      "total_errors": totalErrorCounter,
      "total_hints": hintCounter,
      "total_resets": resetCounter,
      "translation": translatedText,
      "exercise_context": exerciseContext,
      "bookmark_context": bookmarksToStudy[0].context,
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
    if (userSolutionWordArray.length === 0) { return }
    setIsResetConfirmVisible(true);
  }

  function handleResetConfirm() {
    // Remove all the words from the user
    // solution word array.
    if (isResetConfirmVisible) {
      console.log("Run update counter.");
      setResetCounter(resetCounter + 1);
    }
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

  function handleCheck() {
    // Do nothing if empty
    if (userSolutionWordArray.length === 0) { return }

    setHintCounter(hintCounter + 1);

    // Check if the solution is already the same
    let filterPunctuationSolArray = _getWordsFromWordProps(solutionWords);
    let newUserSolutionWordArray = _filterPlaceholders([...userSolutionWordArray]);

    // Get the Constructed Sentence
    let userSolutionSentence = _getWordsFromWordProps(newUserSolutionWordArray).join(" ");

    if (userSolutionSentence === filterPunctuationSolArray.join(" ")) {
      setIsCluesRowVisible(false);
      setIsCorrect(true);
      _setAllInWordsStatus(newUserSolutionWordArray, "correct");
      setUserSolutionWordArray(newUserSolutionWordArray);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    }
    else {
      // We need to ensure that we don't send the entire sentence,
      // or alignment might align very distant words.
      // We provide only the context up to + 1 what the user has constructed.
      let resizedSolutionText = filterPunctuationSolArray.slice(0, newUserSolutionWordArray.length + 2).join(" ");
      api.annotateClues(
        newUserSolutionWordArray,
        resizedSolutionText,
        exerciseLang,
        (updatedUserSolutionWords) => {
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
        if (wordProp.error_type.slice(0, 2) === "M:" && !wordProp["hasPlaceholders"]) {
          if (wordProp["missBefore"]) {
            newUserSolutionWordArray.push(_constructPlaceholderWordProp(placeholderCounter--, "✎"));
          }
          wordProp["hasPlaceholders"] = true;
          newUserSolutionWordArray.push({ ...wordProp });
          if (!wordProp["missBefore"]) {
            newUserSolutionWordArray.push(_constructPlaceholderWordProp(placeholderCounter--, "✎"));
          }
          wordWasPushed = true;
        }
        else {
          wordProp["hasPlaceholders"] = false;
        }
      };
      if (!wordProp.isCorrect) { errorCount++; }
      if (!wordWasPushed) { newUserSolutionWordArray.push({ ...wordProp }); }
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

  function handleReduceContext() {
    let newIsHandleLongSentences = !isHandlingLongSentences;
    let exerciseIntializeVariables = _get_exercise_start_variables()
    // Handle the case of long sentences, this relies on activating the functionality. 
    prepareContext(
      exerciseIntializeVariables["originalBookmarkContext"],
      exerciseIntializeVariables["bookmarkWord"],
      newIsHandleLongSentences,
      exerciseIntializeVariables["isLongSentence"],
      exerciseIntializeVariables["exerciseStartTime"]);

    // Ensure the exercise time is set to the same that was used 
    // to prepare the exercise, as well as the sentenceTooLong.
    setInitialTime(exerciseIntializeVariables["exerciseStartTime"]);
    setIsSentenceTooLong(exerciseIntializeVariables["isLongSentence"]);
    setIsHandlingLongSentences(newIsHandleLongSentences);
    let jsonDataReduceContext = {
      "bookmark": bookmarksToStudy[0].from,
      "exercise_start": initialTime,
    }
    _orderWordsLogUserActivity("WO_TOGGLE_CONTEXT", jsonDataReduceContext);
    // Handle the case of long sentences, this relies on activating the functionality. 

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
        {strings.orderTheWordsToMakeTheHighlightedPhrase}
        <p className="translatedText">{textBeforeTranslatedText}<b>{translatedText}</b>{textAfterTranslatedText}</p>
      </div>
      {isCluesRowVisible && (
        <sOW.ItemRowCompactWrap className="cluesRow">
          <h4>Clues</h4>
          {clueText.length > 0 && clueText.map((clue, index) => <p key={index}>{clue}</p>)}
        </sOW.ItemRowCompactWrap>
      )}

      {(userSolutionWordArray.length > 0 || !isCorrect) && (
        <div className={`orderWordsItem`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={solutionDrop}>
          <OrderWordsInput
            buttonOptions={userSolutionWordArray}
            notifyChoiceSelection={notifyChoiceSelection}
            incorrectAnswer={isCorrect}
            setIncorrectAnswer={setIsCorrect}
            handleShowSolution={handleShowSolution}
            toggleShow={toggleShow}
            isWordSoup={false}
            onDragStartHandle={solutionDragStart}
            onDragOverHandle={solutionDragOver}
            onDragLeaveHandle={solutionDragLeave}
          />
        </div>
      )}

      {isCorrect &&
        <div className="OWBottomRow">
          <h4>{strings.orderWordsCorrectMessage}</h4>
          <p>{bookmarksToStudy[0].context}</p>
          <p>Word you bookmarked: <b>'{bookmarksToStudy[0].from}'</b></p>
        </div>}

      {wordsReferenceStatus.length === 0 && !isCorrect && <LoadingAnimation />}

      {!isCorrect && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={wordSoupDrop}
        >
          <OrderWordsInput
            buttonOptions={wordsReferenceStatus}
            notifyChoiceSelection={notifyChoiceSelection}
            incorrectAnswer={isCorrect}
            setIncorrectAnswer={setIsCorrect}
            handleShowSolution={handleShowSolution}
            toggleShow={toggleShow}
            isWordSoup={true}
            onDragStartHandle={dragStart}
          />
        </div>
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
          isReadContext={true}
        />
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
      {!isCorrect && (<p className="tipText">{strings.orderWordsTipMessage}</p>)}
      {!isCorrect && ENABLE_SHORTER_CONTEXT_BUTTON && (
        <sOW.ItemRowCompactWrap className="ItemRowCompactWrap">
          <button
            onClick={handleReduceContext}
            className={isHandlingLongSentences ? "owButton reduceContext correct"
              : "owButton reduceContext disable"}>
            Toggle Short Context
          </button>
        </sOW.ItemRowCompactWrap>
      )
      }
    </sOW.ExerciseOW>
  );
}
