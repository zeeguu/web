import { useState, useEffect, useRef, useContext } from "react";
import * as sOW from "./ExerciseTypeOW.sc.js";
import OrderWordsInput from "./OrderWordsInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation, tokenize } from "../../../utils/text/preprocessing";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import { removeArrayDuplicates } from "../../../utils/basic/arrays.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import { CORRECT, HINT, SOLUTION } from "../../ExerciseConstants.js";

export default function OrderWords({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
  toggleShow,
  reload,
  setReload,
  exerciseSessionId,
  exerciseType,
  activeSessionDuration,
}) {
  const api = useContext(APIContext);
  // Constants for Exercise
  const L1_LANG = bookmarksToStudy[0].to_lang;
  const L2_LANG = bookmarksToStudy[0].from_lang;
  const MOVE_ITEM_KEY = -100;
  const MOVE_ITEM_ID = "moveItem";
  const MAX_CONTEXT_LENGTH = 15;
  const ENABLE_SHORTER_CONTEXT_BUTTON = false;
  const SOLUTION_AREA_ID = "solutionAreaId";
  const WORD_SOUP_ID = "wordSoupId";
  const IS_DEBUG = false;
  const EXERCISE_TYPE = exerciseType;
  const TYPE_L1_CONSTRUCTION = "OrderWords_L1";
  const TYPE_L2_CONSTRUCTION = "OrderWords_L2";
  const RIGHT = 0;
  const LEFT = 1;

  const [initialTime, setInitialTime] = useState(new Date());
  const [resetCounter, setResetCounter] = useState(0);
  const [hintCounter, setHintCounter] = useState(0);
  const [totalErrorCounter, setTotalErrorCounter] = useState(0);
  const [wordsReferenceStatus, setWordsReferenceStatus] = useState([]);
  const [messageToAPI, setMessageToApi] = useState("");
  const [exerciseContext, setExerciseContext] = useState("");
  const [clueText, setClueText] = useState([]);
  const [exerciseText, setExerciseText] = useState("");
  const [userSolutionWordArray, setUserSolutionWordArray] = useState([]);
  const [confuseWords, setConfuseWords] = useState();
  const [wordSelected, setWordSelected] = useState();
  const [posSelected, setPosSelected] = useState("");
  const [solutionWords, setSolutionWords] = useState([]);
  const [isCluesRowVisible, setIsCluesRowVisible] = useState(false);
  const [isResetConfirmVisible, setIsResetConfirmVisible] = useState(false);
  const [isHandlingLongSentences, setIsHandlingLongSentences] = useState(true);
  const [isSentenceTooLong, setIsSentenceTooLong] = useState(false);
  const [interactiveText, setInteractiveText] = useState();
  const [textBeforeExerciseText, setTextBeforeExerciseText] = useState("");
  const [textAfterExerciseText, setTextAfterExerciseText] = useState("");
  const [movingObject, setMovingObject] = useState();
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );

  // for when we are dragging things from the solution area
  const solutionDragIndex = useRef(); // the one we are dragging
  const solutionDragOverIndex = useRef(); // the one we are dragging over

  const isDragPlacementLeft = useRef();
  const wordSoupDrag = useRef();
  const moveOverElement = useRef();
  const moveLastPosition = useRef();
  const moveElement = useRef();
  const moveElementInitialPosition = useRef();
  const scrollY = useRef();
  const speech = useContext(SpeechContext);

  // Exercise Functions / Setup / Handle Interactions

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    let exerciseIntializeVariables = _get_exercise_start_variables();
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      if (IS_DEBUG) console.log("Setting article info.");
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo,
          api,
          "TRANSLATE WORDS IN EXERCISE",
          EXERCISE_TYPE,
          speech,
        ),
      );
    });
    if (IS_DEBUG) console.log("Preparing Context");
    // Handle the case of long sentences, this relies on activating the functionality.
    prepareContext(
      exerciseIntializeVariables["originalBookmarkContext"],
      exerciseIntializeVariables["bookmarkWord"],
      isHandlingLongSentences,
      exerciseIntializeVariables["isLongSentence"],
      exerciseIntializeVariables["exerciseStartTime"],
    );

    // Ensure the exercise time is set to the same that was used
    // to prepare the exercise, as well as the sentenceTooLong.
    setInitialTime(exerciseIntializeVariables["exerciseStartTime"]);
    setIsSentenceTooLong(exerciseIntializeVariables["isLongSentence"]);
    // eslint-disable-next-line
  }, []);

  function prepareContext(
    originalContext,
    bookmarkWord,
    isHandleLongSentences,
    isCurrentSentenceTooLong,
    exerciseStartTime,
  ) {
    if (IS_DEBUG) console.log("Status of isHandle: " + isHandleLongSentences);
    if (IS_DEBUG) console.log(isCurrentSentenceTooLong);
    if (isHandleLongSentences && isCurrentSentenceTooLong) {
      if (IS_DEBUG) console.log("Getting smaller context.");
      api.getSmallerContext(
        originalContext,
        bookmarkWord,
        L2_LANG,
        MAX_CONTEXT_LENGTH,
        (apiCandidateSubSent) => {
          let shorterContext = JSON.parse(apiCandidateSubSent);
          prepareExercise(
            shorterContext,
            isCurrentSentenceTooLong,
            isHandleLongSentences,
            exerciseStartTime,
          );
        },
      );
    } else {
      if (IS_DEBUG) console.log("Using default context.");
      prepareExercise(
        originalContext,
        isCurrentSentenceTooLong,
        isHandleLongSentences,
        exerciseStartTime,
      );
    }
  }

  function prepareExercise(
    exerciseContext,
    isSentenceTooLong,
    isHandlingLongSentences,
    startTime,
  ) {
    if (IS_DEBUG) console.log("CONTEXT: '" + exerciseContext + "'");
    exerciseContext = exerciseContext.trim();
    if (IS_DEBUG) console.log("CONTEXT AFTER TRIM: '" + exerciseContext + "'");
    if (IS_DEBUG) console.log("Getting Translation for ->" + exerciseContext);

    setExerciseContext(exerciseContext);

    let originalContext = bookmarksToStudy[0].context.trim();

    api
      .basicTranlsate(L2_LANG, localStorage.native_language, exerciseContext)
      .then((response) => response.json())
      .then((data) => {
        let translatedContext = data["translation"];
        // Line below is used for development with no API key (translatedContext is Null)
        if (!translatedContext) {
          translatedContext = exerciseContext;
        }
        if (exerciseContext.length < originalContext.length) {
          let startPos = originalContext.indexOf(exerciseContext);
          let contextLen = originalContext.length;
          let textBeforeContext = originalContext.slice(0, startPos);
          if (textBeforeContext[-1] !== " ") {
            textBeforeContext = textBeforeContext + " ";
          }
          setTextBeforeExerciseText(textBeforeContext);
          setTextAfterExerciseText(
            originalContext.slice(
              startPos + exerciseContext.length,
              contextLen,
            ),
          );
        }
        if (EXERCISE_TYPE === TYPE_L1_CONSTRUCTION) {
          setExerciseText(exerciseContext);
          addConfusionWords(
            exerciseContext,
            translatedContext,
            isSentenceTooLong,
            isHandlingLongSentences,
            startTime,
            true,
          );
        } else if (EXERCISE_TYPE === TYPE_L2_CONSTRUCTION) {
          setExerciseText(translatedContext);
          addConfusionWords(
            exerciseContext,
            translatedContext,
            isSentenceTooLong,
            isHandlingLongSentences,
            startTime,
            false,
          );
        }
      })
      .catch(() => {
        let translationError = "Error retrieving the translation.";
        setExerciseText(translationError);
        if (IS_DEBUG) console.log("could not retreive translation");
        setConfuseWords([]);
        setWordsReferenceStatus([""]);
        let jsonDataExerciseStart = {
          error: translationError,
          bookmark: bookmarksToStudy[0].from,
          exercise_start: startTime,
        };
        _orderWordsLogUserActivity("WO_START", jsonDataExerciseStart);
      });
  }

  /*
        Tracking the current scroll on mobile
         */
  const handleTouchScroll = () => {
    let prevElement = document.getElementById("orderExercise");
    let currentElement = prevElement;
    while (currentElement != null) {
      prevElement = currentElement;
      if (prevElement.scrollTop !== 0) {
        break;
      }
      currentElement = currentElement.parentNode;
    }
    if (prevElement.scrollTop != null) scrollY.current = prevElement.scrollTop;
    else scrollY.current = 0;
  };

  // * * * * * * * * * * * * * * * * * * * * *
  // Handling events related to drag and drop
  // * * * * * * * * * * * * * * * * * * * * *

  // Everything that has solution is events for the words in the solution area
  const solutionOnDragStart = (e, arrayIndex) => {
    // Do not perform any actions if the exercise
    // is correct.
    if (isCorrect) return;

    let wordInfo = { ...userSolutionWordArray[arrayIndex] };
    solutionDragIndex.current = arrayIndex;
    moveElement.current = e.target;
    _setOnDragStartVariables(e, wordInfo);
  };

  const solutionOnTouchStart = (e, arrayIndex) => {
    solutionOnDragStart(e, arrayIndex);
  };

  const solutionOnTouchMove = (e) => {
    // Equivalent to SolutionDragOver
    if (isCorrect) return;

    let touch = e.touches[0] || e.changedTouches[0];
    let x = touch.pageX;
    let y = touch.pageY;
    moveLastPosition.current = [x, y];
    let moveElement = document.getElementById(MOVE_ITEM_ID);
    // Move the Dragging Object
    _performMoveItem(x, y, moveElementInitialPosition, moveElement);
    let elementList = document.elementsFromPoint(x, y);
    elementList = elementList.filter(
      (e) =>
        e.tagName === "BUTTON" &&
        (e.parentNode.classList.contains("ItemRowCompactWrapConstruct") ||
          e.parentNode.id === SOLUTION_AREA_ID),
    );
    let element = null;
    if (elementList.length > 1) element = elementList[1];
    else if (elementList.length === 1) element = elementList[0];
    if (element == null && moveOverElement.current != null) {
      // We are not hovering any object, we clear the object we were hovering.
      _clearMoveOverObject();
      return;
    }
    if (moveOverElement.current == null) {
      // We are hovering a new object
      moveOverElement.current = element;
    } else if (moveOverElement.current !== element) {
      // We are over a new element.
      _clearMoveOverObject();
    } else {
      // We are hovering the same element - update the CSS based on the
      // side we are hovering.
      let touchSide = _getObjectSide([x, y], moveOverElement.current);
      _setSideStyling(moveOverElement.current, touchSide);
      isDragPlacementLeft.current = touchSide;
    }
  };

  const solutionOnDragOver = (e, arrayIndex) => {
    // Add the styling to the object one is hovering over, this will display
    // where the token will be placed in relation to the hovered object.
    if (arrayIndex === solutionDragIndex.current || isCorrect) {
      return;
    }
    let element = e.target;
    let mouseSide = _getObjectSide([e.clientX, e.clientY], element);
    _setSideStyling(element, mouseSide);
    solutionDragOverIndex.current = arrayIndex;
    moveOverElement.current = e.target;
    isDragPlacementLeft.current = mouseSide;
  };

  const solutionOnDragLeave = (e, position) => {
    if (position === solutionDragIndex.current || isCorrect) {
      return;
    }
    e.target.classList.remove("toDragRight");
    e.target.classList.remove("toDragLeft");
    isDragPlacementLeft.current = false;
    solutionDragOverIndex.current = null;
  };

  const solutionOnTouchEnd = (e) => {
    function _clearMoveItem(element) {
      if (element != null) {
        moveElement.current.classList.remove("elementHidden");
        element.style.position = "";
        element.style.left = "";
        element.style.top = "";
        element.style.zIndex = "";
      }
    }

    if (isCorrect) return;
    _clearMoveItem(moveElement.current);
    if (moveLastPosition.current == null) {
      _clearMoveOverObject();
      _resetDragStatuses();
      return;
    }
    let x = moveLastPosition.current[0];
    let y = moveLastPosition.current[1];
    let dropLocation = document.elementsFromPoint(x, y);
    dropLocation = dropLocation.filter(
      (e) => e.id === WORD_SOUP_ID || e.id === SOLUTION_AREA_ID,
    );
    if (dropLocation.length === 0) {
      // We didn't drop the element in any of the relevant areas.
      _clearMoveOverObject();
      _resetDragStatuses();
    } else {
      let x = moveLastPosition.current[0];
      let y = moveLastPosition.current[1];
      performSolutionDrop(x, y);
    }
  };

  const solutionOnDropEnd = (e) => {
    let x = e.pageX;
    let y = e.pageY;
    performSolutionDrop(x, y);
  };

  function performSolutionDrop(x, y) {
    if (isCorrect) return;
    _clearMoveOverObject();
    let dropLocation = document.elementsFromPoint(x, y);
    dropLocation = dropLocation.filter(
      (e) => e.id === WORD_SOUP_ID || e.id === SOLUTION_AREA_ID,
    );
    // Create the array to be modified
    let copyUserSolutionWordArray = [...userSolutionWordArray];
    if (
      copyUserSolutionWordArray.length === 0 &&
      wordSoupDrag.current != null &&
      dropLocation[0].id === SOLUTION_AREA_ID
    ) {
      // We are adding a word from the word soup
      // call the method that handles adding words.
      notifyChoiceSelection(wordSoupDrag.current, false);
      _resetDragStatuses();
      return;
    }

    if (wordSoupDrag != null || solutionDragIndex != null) {
      // We are dragging and there are elements
      let isDragOverPlaceholder = false;
      let dragOverId = null;
      // If there is an element dragged over, then we are going to
      // reset the status and place the item
      if (solutionDragOverIndex.current != null) {
        isDragOverPlaceholder =
          copyUserSolutionWordArray[solutionDragOverIndex.current]
            .isPlaceholder;
        if (isDragOverPlaceholder) {
          dragOverId =
            copyUserSolutionWordArray[solutionDragOverIndex.current].id;
        }
      }

      if (solutionDragIndex.current != null) {
        let dragItemContent =
          copyUserSolutionWordArray[solutionDragIndex.current];
        if (dropLocation[0].id === SOLUTION_AREA_ID) {
          // If it is an element from the solution area, we need to swap.
          // If it's null then place it in the same place.
          if (solutionDragOverIndex.current == null)
            solutionDragOverIndex.current = solutionDragIndex.current;
          copyUserSolutionWordArray.splice(solutionDragIndex.current, 1);
          let isPositionAffected =
            solutionDragOverIndex.current > solutionDragIndex.current ? 1 : 0;
          if (isDragPlacementLeft.current === RIGHT) {
            copyUserSolutionWordArray.splice(
              solutionDragOverIndex.current - isPositionAffected + 1,
              0,
              dragItemContent,
            );
          } else
            copyUserSolutionWordArray.splice(
              solutionDragOverIndex.current - isPositionAffected,
              0,
              dragItemContent,
            );
        } else {
          notifyChoiceSelection(dragItemContent.id, false);
          _resetDragStatuses();
          return;
        }
      } else if (wordSoupDrag.current != null) {
        // If it's an element from the word soup we add it to the solution
        // based on the order item.
        if (solutionDragOverIndex.current != null) {
          let copyWordsReferenceStatus = [...wordsReferenceStatus];
          let elementToAdd = _getWordById(
            wordSoupDrag.current,
            copyWordsReferenceStatus,
          );
          elementToAdd.inUse = true;
          if (isDragPlacementLeft.current === RIGHT)
            copyUserSolutionWordArray.splice(
              solutionDragOverIndex.current + 1,
              0,
              { ...elementToAdd },
            );
          else
            copyUserSolutionWordArray.splice(solutionDragOverIndex.current, 0, {
              ...elementToAdd,
            });
          setWordsReferenceStatus(copyWordsReferenceStatus);
        } else if (dropLocation[0].id === SOLUTION_AREA_ID) {
          notifyChoiceSelection(wordSoupDrag.current, false);
          _resetDragStatuses();
          return;
        }
      }

      if (isDragOverPlaceholder) {
        // if it was a place holder we remove it from the solution box.
        copyUserSolutionWordArray = copyUserSolutionWordArray.filter(
          (word) => word.id !== dragOverId,
        );
      }
    }
    // Reset all drag statuses to null.
    // Update the solution array.
    setUserSolutionWordArray(copyUserSolutionWordArray);
    _resetDragStatuses();
  }

  // There are fewer events that wordSoup elements handle because they don't react on being hovered over
  const wordSoupOnDragStart = (e, wordId) => {
    // Do not perform any actions if the exercise
    // is correct.
    if (isCorrect) return;

    let wordInfo = _getWordById(wordId, wordsReferenceStatus);
    moveElement.current = e.target;
    wordSoupDrag.current = wordId;
    _setOnDragStartVariables(e, { ...wordInfo });
  };
  const wordSoupOnTouchStart = (e, wordId) => {
    wordSoupOnDragStart(e, wordId);
  };
  const wordSoupOnDrop = (e) => {
    if (isCorrect) return;
    if (wordSoupDrag.current) {
      // Do nothing:
      wordSoupDrag.current = null;
    }
    if (solutionDragIndex.current != null) {
      let wordItem = userSolutionWordArray[solutionDragIndex.current];
      notifyChoiceSelection(wordItem.id);
    }
    _resetDragStatuses();
  };

  if (IS_DEBUG) console.log("Running ORDER WORDS EXERCISE");

  function _removeEmptyTokens(tokenList) {
    // In some instance, there will be punctuation in the middle, which
    // results in trailing spaces. The loop below ensures those get removed.
    return tokenList.filter((token) => token !== "");
  }

  function _getWordsInSentence(sentence) {
    let wordsForExercise = tokenize(removePunctuation(sentence));
    // A lot of  articles start with a dash. ( - )
    if (wordsForExercise[0] === "-")
      wordsForExercise = wordsForExercise.splice(1);
    return _removeEmptyTokens(wordsForExercise);
  }

  function _getWordsFromWordProps(wordPropList) {
    // Retrieves the str from the property dictionary.
    // See the intialization/description at _initializeWordProps
    let wordList = [];
    for (let i = 0; i < wordPropList.length; i++) {
      wordList.push(wordPropList[i]["word"]);
    }
    return wordList;
  }

  function _initializeWordProps(wordList, sentenceWords) {
    /*
                Create an word object with the following properties:
                  To be set by the component:
                  - id:int , position in the array
                  - word:str, the token string
                  - status:str, the class for the object (correct, incorrect)
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
    let arrayWordsProps = [];
    for (let i = 0; i < wordList.length; i++) {
      let isInSetence = sentenceWords.includes(wordList[i]) ? true : false;
      arrayWordsProps.push({
        id: i,
        word: wordList[i],
        status: "",
        inUse: false,
        feedback: "",
        missBefore: false,
        isInSentence: isInSetence,
        hasPlaceholders: false,
      });
    }
    return arrayWordsProps;
  }

  function _orderWordsLogUserActivity(eventType, jsonData) {
    if (IS_DEBUG) {
      console.log("LOG EVENT, type: " + eventType);
      console.log(jsonData);
    }
    jsonData["exercise_type"] = EXERCISE_TYPE;
    api.logUserActivity(
      eventType,
      "",
      bookmarksToStudy[0].id,
      JSON.stringify(jsonData),
    );
  }

  function _logUserActivityCheck(
    constructedSentence,
    resizeSol,
    errorCount,
    finalClueText,
    errorTypesList,
    updatedErrorCounter,
  ) {
    let jsonDataExerciseCheck = {
      constructed_sent: constructedSentence,
      solution_sent: resizeSol,
      n_errors: errorCount,
      feedback_given: finalClueText,
      error_types: errorTypesList,
      total_errors: updatedErrorCounter,
      exercise_time: getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      exercise_start: initialTime,
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
    return array;
  }

  function _constructPlaceholderWordProp(id, symbol) {
    let placeholderWProp = {
      id: id,
      word: symbol,
      isPlaceholder: true,
      inUse: true,
      status: "placeholder incorrect",
    };
    return placeholderWProp;
  }

  function _filterPlaceholders(constructedWordArray) {
    let filterArray = constructedWordArray.filter(
      (wordElement) =>
        wordElement.id < wordsReferenceStatus.length && wordElement.id >= 0,
    );
    for (let i = 0; i < filterArray.length; i++) {
      let wordProp = filterArray[i];
      wordProp["hasPlaceholders"] = false;
    }
    return filterArray;
  }

  function _updateClueText(cluesTextList) {
    if (IS_DEBUG) console.log(cluesTextList);
    let finalClueText = [];

    if (cluesTextList.length > 0) {
      setIsCluesRowVisible(true);
    }
    if (cluesTextList.length <= 2) {
      finalClueText = cluesTextList;
    } else {
      finalClueText = cluesTextList.slice(0, 2);
      if (!finalClueText.includes("Please look at the other errors."))
        finalClueText.push(strings.orderWordsOnlyTwoMessagesShown);
    }
    return finalClueText;
  }

  function _get_exercise_start_variables() {
    let originalContext = bookmarksToStudy[0].context;
    let isCheckLongSentence = false;
    let newExerciseStartTime = new Date();
    if (originalContext.split(" ").length > 15) {
      isCheckLongSentence = true;
    }
    let exercise_start_data = {
      originalBookmarkContext: originalContext,
      bookmarkWord: bookmarksToStudy[0].from,
      isLongSentence: isCheckLongSentence,
      exerciseStartTime: newExerciseStartTime,
    };
    return exercise_start_data;
  }

  function addConfusionWords(
    exerciseContext,
    translatedContext,
    isSentenceTooLong,
    isHandlingLongSentences,
    startTime,
    is_L1,
  ) {
    const initialWords = is_L1
      ? _getWordsInSentence(translatedContext)
      : _getWordsInSentence(exerciseContext);
    setSolutionWords(_initializeWordProps([...initialWords], initialWords));
    if (!is_L1) {
      api.getConfusionWords(L2_LANG, exerciseContext, (cWords) => {
        let jsonCWords = JSON.parse(cWords);
        let apiConfuseWords = jsonCWords["confusion_words"];
        let exerciseWords = [...initialWords].concat(apiConfuseWords);
        let pos_picked = jsonCWords["pos_picked"];
        let word_used = jsonCWords["word_used"];
        prepareWordItems(
          initialWords,
          translatedContext,
          apiConfuseWords,
          isSentenceTooLong,
          isHandlingLongSentences,
          startTime,
          exerciseWords,
          pos_picked,
          word_used,
        );
      });
    } else {
      let exerciseWords = [...initialWords];
      let apiConfuseWords = [];
      let pos_picked = "";
      let word_used = "";
      prepareWordItems(
        initialWords,
        translatedContext,
        apiConfuseWords,
        isSentenceTooLong,
        isHandlingLongSentences,
        startTime,
        exerciseWords,
        pos_picked,
        word_used,
      );
    }
  }

  function prepareWordItems(
    initialWords,
    translatedContext,
    apiConfuseWords,
    isSentenceTooLong,
    isHandlingLongSentences,
    startTime,
    exerciseWords,
    pos_picked,
    word_used,
  ) {
    exerciseWords = shuffle(exerciseWords);
    let propWords = _initializeWordProps(exerciseWords, initialWords);
    setWordsReferenceStatus(propWords);
    setConfuseWords(apiConfuseWords);
    setPosSelected(pos_picked);
    setWordSelected(word_used);
    let jsonDataExerciseStart = {
      sentence_was_too_long: isSentenceTooLong,
      sentence_context_was_reduced: isHandlingLongSentences,
      translation: translatedContext,
      exercise_context: exerciseContext,
      bookmark_context: bookmarksToStudy[0].context,
      confusionWords: apiConfuseWords,
      pos: pos_picked,
      word_for_confusion: word_used,
      total_words: exerciseWords.length,
      bookmark: bookmarksToStudy[0].from,
      exercise_start: startTime,
    };
    _orderWordsLogUserActivity("WO_START", jsonDataExerciseStart);
  }

  function notifyChoiceSelection(selectedChoice, inUse) {
    handleUndoResetStatus();
    // Avoid swapping Words when the exercise isCorrect.
    // this means we have finished the exercise.
    if (isCorrect || selectedChoice < 0) {
      return;
    }
    // Create objects to update.
    let updatedReferenceStatus = [...wordsReferenceStatus];
    let newUserSolutionWordArray = [...userSolutionWordArray];

    let wordSelected = _getWordById(selectedChoice, updatedReferenceStatus);

    // Add the Word to the userSolutionArea
    if (!wordSelected.inUse) {
      newUserSolutionWordArray.push({ ...wordSelected });
      newUserSolutionWordArray[newUserSolutionWordArray.length - 1].inUse =
        !wordSelected.inUse;
    } else {
      // In case the user selected the same word twice, we remove it.
      newUserSolutionWordArray = newUserSolutionWordArray.filter(
        (wordElement) => wordElement.id !== wordSelected.id,
      );
    }
    // Toggle the inUse flag
    wordSelected.inUse = !wordSelected.inUse;

    // Remove the last placeholder token if a user adds a token
    // Leave all other placeholders.
    if (newUserSolutionWordArray.length > 2) {
      // Check if the previous token (before the one the user just added)
      // is a placeholder token
      let previousIdToken =
        newUserSolutionWordArray[newUserSolutionWordArray.length - 2].id;
      if (previousIdToken < 0) {
        // Is a placeholder token
        newUserSolutionWordArray = newUserSolutionWordArray.filter(
          (word) => word.id !== previousIdToken,
        );
      }
    }

    setWordsReferenceStatus(updatedReferenceStatus);
    setUserSolutionWordArray(newUserSolutionWordArray);
  }

  function handleShowSolution() {
    // Ensure Rest and Swap are reset
    handleUndoResetStatus();

    let message = messageToAPI + SOLUTION;
    // Construct the Sentence to show the solution.
    let solutionWord = [...solutionWords];
    _setAllInWordsStatus(solutionWord, "correct");
    setUserSolutionWordArray(solutionWord);
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setIsCluesRowVisible(false);
    handleAnswer(message);
  }

  function handleAnswer(message) {
    setMessageToApi(message);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );

    let jsonDataExerciseEnd = {
      sentence_was_too_long: isSentenceTooLong,
      sentence_context_was_reduced: isHandlingLongSentences,
      outcome: message,
      total_time: getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      total_errors: totalErrorCounter,
      total_hints: hintCounter,
      total_resets: resetCounter,
      exercise_text: exerciseText,
      exercise_context: exerciseContext,
      bookmark_context: bookmarksToStudy[0].context,
      bookmark: bookmarksToStudy[0].from,
      confusionWords: confuseWords,
      pos: posSelected,
      word_for_confusion: wordSelected,
      exercise_start: initialTime,
    };
    _orderWordsLogUserActivity("WO_END", jsonDataExerciseEnd);
  }

  function handleResetClick() {
    // Don't allow the user to click rest if no words
    // are in the userSolutionArray
    if (userSolutionWordArray.length === 0) {
      return;
    }
    setIsResetConfirmVisible(true);
  }

  function handleResetConfirm() {
    // Remove all the words from the user
    // solution word array.
    if (isResetConfirmVisible) {
      if (IS_DEBUG) console.log("Run update counter.");
      setResetCounter(resetCounter + 1);
    }
    let resetWords = [...wordsReferenceStatus];
    for (let i = 0; i < resetWords.length; i++) {
      resetWords[i].inUse = false;
    }
    if (IS_DEBUG) console.log(resetWords);
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
    if (userSolutionWordArray.length === 0) {
      return;
    }

    setHintCounter(hintCounter + 1);

    // Check if the solution is already the same
    let filterPunctuationSolArray = _getWordsFromWordProps(solutionWords);
    let newUserSolutionWordArray = _filterPlaceholders([
      ...userSolutionWordArray,
    ]);

    // Get the Constructed Sentence
    let userSolutionSentence = _getWordsFromWordProps(
      newUserSolutionWordArray,
    ).join(" ");

    if (userSolutionSentence === filterPunctuationSolArray.join(" ")) {
      setIsCluesRowVisible(false);
      setIsCorrect(true);
      _setAllInWordsStatus(newUserSolutionWordArray, "correct");
      setUserSolutionWordArray(newUserSolutionWordArray);
      let concatMessage = messageToAPI + CORRECT;
      notifyCorrectAnswer(bookmarksToStudy[0]);
      handleAnswer(concatMessage);
    } else {
      // We need to ensure that we don't send the entire sentence,
      // or alignment might align very distant words.
      // We provide only the context up to + 1 what the user has constructed.
      let resizedSolutionText = filterPunctuationSolArray
        .slice(0, newUserSolutionWordArray.length + 2)
        .join(" ");
      setMessageToApi(messageToAPI + HINT);
      let nlp_model_to_use =
        EXERCISE_TYPE === TYPE_L1_CONSTRUCTION ? L1_LANG : L2_LANG;
      api.annotateClues(
        newUserSolutionWordArray,
        resizedSolutionText,
        nlp_model_to_use,
        (updatedUserSolutionWords) => {
          updateWordsFromAPI(
            updatedUserSolutionWords,
            resizedSolutionText,
            userSolutionSentence,
          );
        },
      );
    }
  }

  function updateWordsFromAPI(
    updatedWordStatusFromAPI,
    resizeSol,
    constructedSentence,
  ) {
    // Variable to update and store in the user Activity.
    let updatedWordStatus = JSON.parse(updatedWordStatusFromAPI);
    let cluesTextList = [];
    let errorTypesList = [];
    let newWordsReferenceStatus = [...wordsReferenceStatus];
    let newUserSolutionWordArray = [];
    let errorCount = 0;
    // Placeholders are negative in this exercise.
    let placeholderCounter = -1;

    if (IS_DEBUG) console.log(updatedWordStatus);
    for (let i = 0; i < updatedWordStatus.length; i++) {
      let wordWasPushed = false;
      let wordProp = updatedWordStatus[i];
      // Sync up the status. The IDs reflect the order of the tokens
      // in the wordReferenceStatus array.
      newWordsReferenceStatus[wordProp.id] = wordProp;

      if (wordProp.feedback !== "" && !wordProp.isCorrect) {
        cluesTextList.push(wordProp.feedback);
        errorTypesList.push(wordProp.error_type);
        if (
          wordProp.error_type.slice(0, 2) === "M:" &&
          !wordProp["hasPlaceholders"]
        ) {
          if (wordProp["missBefore"]) {
            newUserSolutionWordArray.push(
              _constructPlaceholderWordProp(placeholderCounter--, "✎"),
            );
          }
          wordProp["hasPlaceholders"] = true;
          newUserSolutionWordArray.push({ ...wordProp });
          if (!wordProp["missBefore"]) {
            newUserSolutionWordArray.push(
              _constructPlaceholderWordProp(placeholderCounter--, "✎"),
            );
          }
          wordWasPushed = true;
        } else {
          wordProp["hasPlaceholders"] = false;
        }
      }
      if (!wordProp.isCorrect) {
        errorCount++;
      }
      if (!wordWasPushed) {
        newUserSolutionWordArray.push({ ...wordProp });
      }
    }
    cluesTextList = removeArrayDuplicates(cluesTextList);
    if (IS_DEBUG) console.log("After adding the placeholders.");
    if (IS_DEBUG) console.log(newUserSolutionWordArray);
    let updatedErrorCounter = totalErrorCounter + errorCount;
    let finalClueText = _updateClueText(cluesTextList, errorCount);
    setUserSolutionWordArray(newUserSolutionWordArray);
    setWordsReferenceStatus(newWordsReferenceStatus);
    setTotalErrorCounter(updatedErrorCounter);
    setClueText(finalClueText);
    _logUserActivityCheck(
      constructedSentence,
      resizeSol,
      errorCount,
      finalClueText,
      errorTypesList,
      updatedErrorCounter,
    );
  }

  function handleReduceContext() {
    let newIsHandleLongSentences = !isHandlingLongSentences;
    let exerciseIntializeVariables = _get_exercise_start_variables();
    // Handle the case of long sentences, this relies on activating the functionality.
    prepareContext(
      exerciseIntializeVariables["originalBookmarkContext"],
      exerciseIntializeVariables["bookmarkWord"],
      newIsHandleLongSentences,
      exerciseIntializeVariables["isLongSentence"],
      exerciseIntializeVariables["exerciseStartTime"],
    );

    // Ensure the exercise time is set to the same that was used
    // to prepare the exercise, as well as the sentenceTooLong.
    setInitialTime(exerciseIntializeVariables["exerciseStartTime"]);
    setIsSentenceTooLong(exerciseIntializeVariables["isLongSentence"]);
    setIsHandlingLongSentences(newIsHandleLongSentences);
    let jsonDataReduceContext = {
      bookmark: bookmarksToStudy[0].from,
      exercise_start: initialTime,
    };
    _orderWordsLogUserActivity("WO_TOGGLE_CONTEXT", jsonDataReduceContext);
    // Handle the case of long sentences, this relies on activating the functionality.
  }

  // Handle the Loading screen while getting the text.
  if (
    (wordsReferenceStatus.length === 0) | (exerciseText === "") &&
    !isCorrect
  ) {
    if (IS_DEBUG) console.log("Running load animation.");
    console.log(exerciseText);
    console.log(wordsReferenceStatus);
    return <LoadingAnimation />;
  }

  return (
    <>
      <sOW.ExerciseOW
        className="orderWords"
        onTouchMove={handleTouchScroll}
        id="orderExercise"
      >
        <div className="headline headlineOrderWords">
          {strings.orderTheWordsToMakeTheHighlightedPhrase}
        </div>
        {isCorrect && EXERCISE_TYPE === TYPE_L1_CONSTRUCTION && (
          <div className="contextExample" style={{ marginBottom: "2em" }}>
            <TranslatableText
              isExerciseOver={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={removePunctuation(exerciseContext)}
            />
          </div>
        )}
        {isCorrect && EXERCISE_TYPE === TYPE_L2_CONSTRUCTION && (
          <div className="contextExample" style={{ marginBottom: "2em" }}>
            <TranslatableText
              isExerciseOver={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={removePunctuation(exerciseContext)}
              overrideBookmarkHighlightText={exerciseText}
            />
          </div>
        )}

        {!isCorrect && (
          <p className="headlineOrderWords translatedText">
            {textBeforeExerciseText}
            <b>{exerciseText}</b>
            {textAfterExerciseText}
          </p>
        )}

        {isCluesRowVisible && (
          <sOW.ItemRowCompactWrap className="cluesRow">
            <h4>Clues</h4>
            {clueText.length > 0 &&
              clueText.map((clue, index) => <p key={index}>{clue}</p>)}
          </sOW.ItemRowCompactWrap>
        )}

        {(userSolutionWordArray.length > 0 || !isCorrect) && (
          <div
            className={`orderWordsItem`}
            id={SOLUTION_AREA_ID}
            onDragOver={(e) => e.preventDefault()}
            onDrop={solutionOnDropEnd}
            onTouchEnd={solutionOnTouchEnd}
          >
            <OrderWordsInput
              buttonOptions={userSolutionWordArray}
              notifyChoiceSelection={notifyChoiceSelection}
              isCorrect={isCorrect}
              setIsCorrect={setIsCorrect}
              handleShowSolution={handleShowSolution}
              toggleShow={toggleShow}
              isWordSoup={false}
              onDragStartHandle={solutionOnDragStart}
              onDragOverHandle={solutionOnDragOver}
              onDragLeaveHandle={solutionOnDragLeave}
              onTouchStartHandle={solutionOnTouchStart}
              onTouchMoveHandle={solutionOnTouchMove}
            />
          </div>
        )}

        {wordsReferenceStatus.length === 0 && !isCorrect && (
          <LoadingAnimation />
        )}

        {!isCorrect && (
          <div
            id={WORD_SOUP_ID}
            onDragOver={(e) => e.preventDefault()}
            onDrop={wordSoupOnDrop}
            onTouchEnd={solutionOnTouchEnd}
          >
            <OrderWordsInput
              buttonOptions={wordsReferenceStatus}
              notifyChoiceSelection={notifyChoiceSelection}
              incorrectAnswer={isCorrect}
              setIncorrectAnswer={setIsCorrect}
              handleShowSolution={handleShowSolution}
              toggleShow={toggleShow}
              isWordSoup={true}
              onDragStartHandle={wordSoupOnDragStart}
              onTouchStartHandle={wordSoupOnTouchStart}
              onTouchMoveHandle={solutionOnTouchMove}
            />
          </div>
        )}

        {!isCorrect && (
          <sOW.ItemRowCompactWrap className="ItemRowCompactWrap">
            <button
              onClick={handleResetClick}
              className={
                userSolutionWordArray.length > 0
                  ? "owButton undo"
                  : "owButton disable"
              }
            >
              ↻ {strings.reset}
            </button>
            <button
              onClick={handleCheck}
              className={
                userSolutionWordArray.length > 0
                  ? "owButton check"
                  : "owButton disable"
              }
            >
              {solutionWords.length <= userSolutionWordArray.length
                ? strings.check
                : strings.hint}{" "}
              ✔
            </button>
          </sOW.ItemRowCompactWrap>
        )}

        {isResetConfirmVisible && (
          <div className="resetConfirmBar">
            <button onClick={handleUndoResetStatus} className="owButton undo">
              {strings.undo}
            </button>
            <p>{strings.corfirmReset}</p>
            <button onClick={handleResetConfirm} className="owButton check">
              {strings.confirm}
            </button>
          </div>
        )}
        <NextNavigation
          exerciseType={EXERCISE_TYPE}
          message={messageToAPI}
          // Added an empty bookmark to avoid showing the
          // Listen Button.
          exerciseBookmark={bookmarksToStudy[0]}
          moveToNextExercise={moveToNextExercise}
          reload={reload}
          setReload={setReload}
          isReadContext={true}
          handleShowSolution={handleShowSolution}
          toggleShow={toggleShow}
          isCorrect={isCorrect}
        />
        {!isCorrect && (
          <p className="tipText">{strings.orderWordsTipMessage}</p>
        )}
        {!isCorrect && ENABLE_SHORTER_CONTEXT_BUTTON && (
          <sOW.ItemRowCompactWrap className="ItemRowCompactWrap">
            <button
              onClick={handleReduceContext}
              className={
                isHandlingLongSentences
                  ? "owButton reduceContext correct"
                  : "owButton reduceContext disable"
              }
            >
              Toggle Short Context
            </button>
          </sOW.ItemRowCompactWrap>
        )}
        {movingObject && (
          <sOW.OrangeItemCompact
            id={MOVE_ITEM_ID}
            key={MOVE_ITEM_KEY}
            status={movingObject.inUse}
            className={movingObject.status + " renderDisable"}
          >
            {movingObject.word}
          </sOW.OrangeItemCompact>
        )}
      </sOW.ExerciseOW>
    </>
  );

  // Touch / Mouse Drag n' Drop
  // Helper Functions

  function _setOnDragStartVariables(e, wordInfo) {
    function _setMoveInitialPosition(x, y) {
      moveLastPosition.current = [x, y];
      moveElementInitialPosition.current = [x, y];
    }

    scrollY.current = 0;
    let x, y;
    if (e.type === "touchstart") {
      let touch = e.touches[0] || e.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
    } else {
      x = e.pageX;
      y = e.pageY;
    }
    _setMoveInitialPosition(x, y);
    setMovingObject(wordInfo);
  }

  function _clearMoveOverObject() {
    if (moveOverElement.current != null) {
      moveOverElement.current.classList.remove("toDragLeft");
      moveOverElement.current.classList.remove("toDragRight");
      let parentElement = moveOverElement.current.parentElement;
      if (parentElement) {
        let listElements = parentElement.children;
        if (!listElements) listElements = [];
        for (let i = 0; i < listElements.length; i++) {
          if (listElements[i] === moveOverElement.current) {
            solutionDragOverIndex.current = i;
            break;
          }
        }
      }
      moveOverElement.current = null;
    }
  }

  /*
        Returns RIGHT if the mouse is to the right or LEFT if the mouse is to the left.
         */
  function _getObjectSide(point, object) {
    function _getPosition(elem) {
      // Found: https://stackoverflow.com/questions/9040768/getting-coordinates-of-objects-in-js

      let dims = {
        offsetLeft: 0,
        offsetTop: 0,
        width: elem.offsetWidth,
        height: elem.offsetHeight,
      };

      do {
        dims.offsetLeft += elem.offsetLeft;
        dims.offsetTop += elem.offsetTop;
      } while ((elem = elem.offsetParent));

      return dims;
    }

    let x = point[0];

    let objectBoundingBox = _getPosition(object);
    let objectMidpoint =
      objectBoundingBox.offsetLeft + objectBoundingBox.width / 2;
    return x < objectMidpoint ? LEFT : RIGHT;
  }

  function _performMoveItem(x, y, initialPosition, element) {
    if (element != null) {
      let dx = x - initialPosition.current[0];
      let dy = y - initialPosition.current[1];
      let width = element.offsetWidth;
      let height = element.offsetHeight;
      // Hide the original object.
      moveElement.current.classList.add("elementHidden");
      element.style.position = "absolute";
      element.classList.add("moveItem");
      element.style.left = initialPosition.current[0] + dx - width / 2 + "px";
      element.style.top =
        initialPosition.current[1] + dy + scrollY.current - height / 2 + "px";
      element.style.zIndex = "2";
      element.classList.remove("renderDisable");
    }
  }

  function _resetDragStatuses() {
    wordSoupDrag.current = null;
    solutionDragIndex.current = null;
    solutionDragOverIndex.current = null;
    isDragPlacementLeft.current = null;
    moveOverElement.current = null;
    moveLastPosition.current = null;
    moveElement.current = null;
    moveElementInitialPosition.current = null;
    setMovingObject();
  }

  function _setSideStyling(element, mouseSide) {
    if (mouseSide === RIGHT) {
      element.classList.add("toDragRight");
      element.classList.remove("toDragLeft");
    } else {
      element.classList.remove("toDragRight");
      element.classList.add("toDragLeft");
    }
  }
}
