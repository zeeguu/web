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
  const [resetCounter, setResetCounter] = useState(0);
  const [hintCounter, setHintCounter] = useState(0);
  const [totalErrorCounter, setTotalErrorCounter] = useState(0);
  const [posSelected, setPosSelected] = useState("");
  const [wordsMasterStatus, setWordsMasterStatus] = useState([]);
  const [messageToAPI, setMessageToAPI] = useState("");
  const [exerciseLang] = useState(bookmarksToStudy[0].from_lang);
  const [exerciseContext, setExerciseContext] = useState("");
  const [clueText, setClueText] = useState(["Clues go here."]);
  const [translatedText, setTranslatedText] = useState("");
  const [hasClues, setHasClues] = useState(false);
  const [constructorWordArray, setConstructorWordArray] = useState([]);
  const [confuseWords, setConfuseWords] = useState();
  const [wordForConfusion, setWordForConfuson] = useState();
  const [wordSwapId, setwordSwapId] = useState(-1);
  const [wordSwapStatus, setWordSwapStatus] = useState("");
  const [solutionWords, setSolutionWords] = useState([]);
  const [resetConfirmDiv, setResetConfirmDiv] = useState(false);
  const [sentenceWasTooLong, setSentenceWasTooLong] = useState(false);
  const handleLongSentences = false;

  console.log("Running ORDER WORDS EXERCISE")
  function getWordsInArticle(sentence) {
    return removePunctuation(sentence).split(" ")
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

  function prepareExercise(contextToUse){
    console.log("CONTEXT: " + contextToUse);

    const initialWords = getWordsInArticle(contextToUse);
    setSolutionWords(setWordAttributes([...initialWords]));
    console.log("Getting Translation for ->" + contextToUse);
    api
      .basicTranlsate(
        exerciseLang,
        localStorage.native_language,
        contextToUse
      )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setTranslatedText(data["translation"] + ".")
      })
      .catch(() => {
        setTranslatedText("error");
        console.log("could not retreive translation");
      });
    console.log("GETTING WORDS");
    console.log(bookmarksToStudy[0].from_lang);
    api.getConfusionWords(exerciseLang, contextToUse, (cWords) => {
      let jsonCWords = JSON.parse(cWords)
      let apiConfuseWords = jsonCWords["confusion_words"]
      let exerciseWords = [...initialWords].concat(apiConfuseWords);
      console.log(apiConfuseWords);
      console.log("Exercise Words");
      console.log(exerciseWords);
      setConfuseWords(apiConfuseWords);
      exerciseWords = shuffle(exerciseWords);
      let propWords = setWordAttributes(exerciseWords);
      setWordsMasterStatus(propWords);
      setConfuseWords(apiConfuseWords);
      setPosSelected(jsonCWords["pos_picked"]);
      setWordForConfuson(jsonCWords["word_used"]);
      let configuration_wo_start = {
        "sentence_was_too_long": sentenceWasTooLong,
        "translation": translatedText,
        "context": contextToUse,
        "confusionWords": apiConfuseWords,
        "pos": posSelected,
        "word_for_confusion": wordForConfusion,
        "total_words": exerciseWords.length,
        "exercise_start": initialTime,
      }
      api.logUserActivity(
        "WO_START",
        "",
        bookmarksToStudy[0].id,
        JSON.stringify(configuration_wo_start)
      )
    });
    setExerciseContext(contextToUse);
  }

  useEffect(() => {
    let orgiinalContext = bookmarksToStudy[0].context;
    resetStatus();
    // Handle the case of long sentences, this relies on activating the functionality. 
    if (orgiinalContext.split(" ").length > 15 && handleLongSentences) {
      api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
        console.log(articleInfo);
        api.getWOsentences(articleInfo["content"], orgiinalContext,
          exerciseLang, (candidateSents) => {
            setSentenceWasTooLong(true);
            console.log("SENTENCES THAT ARE GOOD FOR WO")
            console.log(candidateSents);
            let candidatesSent = JSON.parse(candidateSents)[0][1]
            console.log(candidatesSent);
            prepareExercise(candidatesSent);
          });
      });
    }
    else{
      console.log("Using default context.");
      prepareExercise(bookmarksToStudy[0].context);
    }
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
    setWordsMasterStatus([]);
  }

  function handleAnswer(message) {
    let pressTime = new Date();
    let duration = pressTime - initialTime
    console.log(duration);
    console.log("^^^^ time elapsed");
    api.uploadExerciseFeedback(
      message,
      EXERCISE_TYPE,
      duration,
      bookmarksToStudy[0].id
    );

    let configuration_wo_end = {
      "sentence_was_too_long": sentenceWasTooLong,
      "outcome": message,
      "total_time": duration,
      "total_errors": totalErrorCounter,
      "total_hints": hintCounter,
      "total_resets": resetCounter,
      "translation": translatedText,
      "context": exerciseContext,
      "confusionWords": confuseWords,
      "pos": posSelected,
      "word_for_confusion": wordForConfusion,
      "exercise_start": initialTime,
    };

    api.logUserActivity(
      "WO_END",
      "",
      bookmarksToStudy[0].id,
      JSON.stringify(configuration_wo_end)
    );
  }

  function resetStatus() {
    if (resetConfirmDiv) {
      console.log("Run update counter.")
      setResetCounter(resetCounter + 1);
    }
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
    setwordSwapId(-1);
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
    setHintCounter(hintCounter + 1);
    // Do nothing if empty
    if (constructorWordArray.length === 0) { return; };

    // Check if the solution is already the same
    let filterPunctuationOGText = removePunctuation(exerciseContext);

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
      let resizeSol = "" + filterPunctuationOGText
      resizeSol = resizeSol.split(" ")
      resizeSol = resizeSol.slice(0, constructorWordArray.length + 1).join(" ")
      api.annotateClues(constructorWordArray, resizeSol, exerciseLang, (updatedMasterStatus) => {
        // Variable to update and store in the user Activity.
        let updatedWordStatus = JSON.parse(updatedMasterStatus);
        let cluesText = [];
        let errorTypes = [];
        let copy_props = [...updatedWordStatus];
        let newWordMasterStatus = [...wordsMasterStatus];
        let errorCount = 0;

        console.log(updatedWordStatus);
        for (let i = 0; i < copy_props.length; i++) {
          let wordProp = copy_props[i];
          newWordMasterStatus[wordProp.id] = wordProp;
          if (wordProp.feedback != "" && !wordProp.isCorrect) {
            cluesText.push(wordProp.feedback);
            errorTypes.push(wordProp.error_type);
          };
          if (!wordProp.isCorrect) { errorCount++; }
        }

        console.log(cluesText);
        let finalClueText = [];
        if (errorCount > 0) { setHasClues(true); }
        if (errorCount <= 2) {
          finalClueText = cluesText.slice(0, 2);
        }
        else {
          finalClueText = cluesText.slice(0, 2).concat([strings.orderWordsOnlyTwoMessagesShown]);;
        }
        setTotalErrorCounter(totalErrorCounter + errorCount);
        setClueText(finalClueText);
        setConstructorWordArray(updatedWordStatus);
        setWordsMasterStatus(newWordMasterStatus);
        let activityLog = {
          "constructed_sent": constructedSentence,
          "solution_sent": resizeSol,
          "n_errors": errorCount,
          "feedback_given": finalClueText,
          "error_types": errorTypes,
          "total_errors": totalErrorCounter,
          "exercise_start": initialTime
        }
        api.logUserActivity(
          "WO_CHECK",
          "",
          bookmarksToStudy[0].id,
          JSON.stringify(activityLog)
        )
      }
      );

      //setAllInWordsStatus("incorrect");

    }
  }

  // Handle the Loading screen while getting the test.
  if ((wordsMasterStatus.length === 0 | translatedText === "") && !isCorrect) {
    console.log("Running load animation.")
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="orderWords">
      {translatedText === "" && !isCorrect && <LoadingAnimation />}
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
        <s.ItemRowCompactWrap className="ItemRowCompactWrap">
          <button onClick={handleReset} className={constructorWordArray.length > 0 ? "owButton undo" : "owButton disable"}>↻ {strings.reset}</button>
          <button onClick={handleCheck} className={constructorWordArray.length > 0 ? "owButton check" : "owButton disable"}>{solutionWords.length === constructorWordArray.length ? strings.check : strings.hint} ✔</button>
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