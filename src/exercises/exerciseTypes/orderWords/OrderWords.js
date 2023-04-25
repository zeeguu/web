import { useState, useEffect } from "react";
import * as s from "../Exercise.sc.js";
import OrderWordsInput from "./OrderWordsInput.js";
import SolutionFeedbackLinks from "../SolutionFeedbackLinks.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import removePunctuation from "../../../assorted/removePunctuation";
import OrderWordsConstruct from "./OrderWordsConstruct.js";
import { nb } from "date-fns/locale";

const EXERCISE_TYPE = "Select_L2W_fitting_L2T";

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
  const [wordsMasterStatus, setWordsMasterStatus] = useState([])
  const [messageToAPI, setMessageToAPI] = useState("");
  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [clueText, setClueText] = useState("Clues go here.");
  const [translatedText, setTranslatedText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [hasClues, setHasClues] = useState(false);
  const [wordsInOrder, setWordsInOrder] = useState([]);
  const [confuseWords, setConfuseWords] = useState([]);
  const [wordSwapId, setwordSwapId] = useState(-1);
  const [wordSwapStatus, setWordSwapStatus] = useState("");
  const [solutionWords, setSolutionWords] = useState([]);
  const [solutionText, setSolutionText] = useState("");

  console.log("Running ORDER WORDS EXERCISE")
  function getWordsInArticle(sentence) {
    // Create an Word Object, that contains the 
    // id, word, status (Correct, Incorrect, Feedback), inUse (true/false)
    let wordsWithPunct = removePunctuation(sentence).toLowerCase().split(" ")
    return wordsWithPunct
  }

  function setWordAttributes(word_list) {
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
    setExerciseType(EXERCISE_TYPE);
    api.wordsSimilarTo(bookmarksToStudy[0].id, (words) => {
      getSimilarWords(words);
    });
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setArticleInfo(articleInfo);
      //console.log("Running Set Sate")
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const initialWords = getWordsInArticle(bookmarksToStudy[0].context)
    let exerciseWords = [...initialWords].concat([...confuseWords]);
    console.log(confuseWords);
    console.log("Exercise Words");
    console.log(exerciseWords);
    exerciseWords = shuffle(exerciseWords)
    const propWords = setWordAttributes(exerciseWords);
    setSolutionWords(setWordAttributes([...initialWords]));
    let solText = [...initialWords].join(" ");
    solText = solText.charAt(0).toUpperCase() + solText.slice(1);
    setSolutionText(solText);
    setTranslatedText(bookmarksToStudy[0].context);
    setOriginalText(bookmarksToStudy[0].context);
    setWordsMasterStatus(propWords);
  }, [confuseWords])

  function caseFirstChar(wordObj, is_upper) {
    if (is_upper) {
      wordObj.word = wordObj.word.charAt(0).toUpperCase() + wordObj.word.slice(1);
    }
    else {
      wordObj.word = wordObj.word.charAt(0).toLowerCase() + wordObj.word.slice(1);
    }
    return wordObj
  }

  function notifyChoiceSelection(selectedChoice, inUse) {
    if (isCorrect) return // Avoid swapping Words when it is correct.
    let current_status = [...wordsMasterStatus]
    let wordSelected = {}
    for (let i = 0; i < current_status.length; i++) {
      if (current_status[i].id === selectedChoice) {
        wordSelected = current_status[i]
        break
      }
    }

    let newWordsInOrder = [...wordsInOrder]

    if (inUse && (wordSwapId === -1)) {
      // Select the Word for Swapping. Set the Color to Orange
      setwordSwapId(selectedChoice)
      console.log(selectedChoice);
      console.log("Selected: " + wordSwapId);
      setWordSwapStatus(wordSelected.status);
      wordSelected.status = "toSwap"
      for (let i = 0; i < newWordsInOrder.length; i++) {
        if (newWordsInOrder[i].id === wordSwapId) {
          newWordsInOrder[i] = wordSelected
          break
        }
      }
      setWordsMasterStatus(current_status);
      setWordsInOrder(newWordsInOrder);
      return
    }

    // Handle the case where we swap a selected word.
    if (wordSwapId !== -1 && selectedChoice !== wordSwapId) {
      console.log("Swapping words!")
      let wordToSwapWith = {}
      for (let i = 0; i < newWordsInOrder.length; i++) {
        if (newWordsInOrder[i].id === wordSwapId) {
          wordToSwapWith = {...newWordsInOrder[i]}
          break
        }
      }
      console.log(wordSelected)
      console.log(wordToSwapWith)
      wordToSwapWith.status = wordSwapStatus;
      setWordSwapStatus("");
      // If the word was not in use.
      if (wordToSwapWith.inUse !== wordSelected.inUse) { wordToSwapWith.inUse = !wordToSwapWith.inUse ; }

      for (let i = 0; i < newWordsInOrder.length; i++) {
        if (newWordsInOrder[i].id === wordSwapId) {
          if (!wordSelected.inUse) { wordSelected.inUse = true}
          newWordsInOrder[i] = wordSelected
        }
        else if (newWordsInOrder[i].id === selectedChoice){
          newWordsInOrder[i] = wordToSwapWith
        }
      }

      for (let i = 0; i < current_status.length; i++) {
        if (current_status[i].id === wordSwapId) {
          current_status[i] = wordToSwapWith
          break
        }
      }

      setWordsMasterStatus(current_status);
      setWordsInOrder(newWordsInOrder);
      setwordSwapId(-1)
      return
    }

    if (newWordsInOrder.length > 0) {
      newWordsInOrder[0] = caseFirstChar(newWordsInOrder[0], true)
    }
    else {
      newWordsInOrder = [caseFirstChar(wordSelected, true)]
    }
    if (!wordSelected.inUse) {
      if (wordsInOrder.length > 0) {
        newWordsInOrder.push(wordSelected)
      }
      setWordsInOrder(newWordsInOrder);
    }
    else {
      wordSelected = caseFirstChar(wordSelected, false)
      newWordsInOrder = newWordsInOrder.filter((wordElement) => wordElement.id !== wordSelected.id)
      setWordsInOrder(newWordsInOrder);
    }
    wordSelected.inUse = !wordSelected.inUse
    console.log("COMPARING STATUS: " + wordSelected.status)
    if(wordSelected.status === "toSwap") { 
      wordSelected.status = wordSwapStatus;
      setWordSwapStatus("");
    }
    console.log("AFTER COMPARING STATUS: " + wordSelected.status)
    setwordSwapId(-1)
    setWordsMasterStatus(current_status)
  }

  function handleShowSolution() {
    let pressTime = new Date();
    console.log(pressTime - initialTime);
    console.log("^^^^ time elapsed");
    let duration = pressTime - initialTime;
    let message = messageToAPI + "S";
    let solutionWord = [...solutionWords]
    console.log(solutionWords)
    for (let i = 0; i < solutionWords.length; i++) {
      solutionWord[i].status = "correct"
    }
    setWordsInOrder(solutionWord);
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setHasClues(false);
    handleAnswer(solutionText, duration);
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

  function getSimilarWords(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      removePunctuation(similarWords[firstRandomInt].toLowerCase()),
      removePunctuation(similarWords[secondRandomInt].toLowerCase()),
    ];
    //let shuffledListOfOptions = shuffle(listOfOptions);
    setConfuseWords(listOfOptions)
    return listOfOptions
    //setButtonOptions(shuffledListOfOptions);
  }

  function handleReset() {
    let resetWords = [...wordsMasterStatus]
    for (let i = 0; i < resetWords.length; i++) {
      resetWords[i].inUse = false;
    }
    setWordsInOrder([]);
    setIsCorrect(false);
    setWordsMasterStatus(resetWords);
  }

  function setAllInWordsStatus(status) {
    let updatedWords = [...wordsMasterStatus]
    let inUseIds = [...wordsInOrder].map(word => word.id)
    console.log(inUseIds)
    for (let i = 0; i < updatedWords.length; i++) {
      if (inUseIds.includes(updatedWords[i].id)) {
        updatedWords[i].status = status
      }
    }
    setWordsMasterStatus(updatedWords)
    // API would update the wordsInOrder Status, here I just set all
    // to wrong.
    let updateWordsInOrder = [...wordsInOrder]
    for (let i = 0; i < updateWordsInOrder.length; i++) {
      if (inUseIds.includes(updateWordsInOrder[i].id)) {
        updateWordsInOrder[i].status = status
      }
    }
    setWordsInOrder(updateWordsInOrder)
  }


  function handleCheck() {
    // Check if the solution is already the same
    if (wordsInOrder.length === 0) {
      setHasClues(true);
      setClueText("You have not added any words.");
      return
    }
    let constructedSentence = []
    for (let i = 0; i < wordsInOrder.length; i++) {
      constructedSentence.push(wordsInOrder[i].word);
    }
    // Get the Sentence

    constructedSentence = constructedSentence.join(" ")
    if (constructedSentence === solutionText) {
      setHasClues(false);
      setIsCorrect(true);
      setAllInWordsStatus("correct");
    }
    else {
      // Handle the Errors and Set the feedback
      // API should return the status, then update the MasterStatus
      console.log("Sentence incorrect!");
      console.log(JSON.stringify(wordsInOrder));
      console.log(JSON.stringify(solutionText));
      setAllInWordsStatus("incorrect");
      setHasClues(true);
      setClueText("Hover the words to see clues.");
      let addFeedbackList = [...wordsInOrder];
      for (let i = 0; i < addFeedbackList.length; i++) {
        addFeedbackList[i].feedback = "Feedback is here, you do this then."
      }
    }
    console.log(constructedSentence)
    console.log(solutionText);

  }

  if (!articleInfo || !confuseWords) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="orderWords">
      <div className="headlineWithMoreSpace">
        {strings.orderTheWordsToMakeTheFollowingSentence}
        <h2>{translatedText}</h2>
      </div>
      {hasClues && (
        <s.ItemRowCompactWrap className="cluesRow">
          <h4>Clues: </h4>
          <p>{clueText}</p>
        </s.ItemRowCompactWrap>
      )}
      {(wordsInOrder.length > 0 || !isCorrect) && (
        <div className="orderWordsItem">
          <OrderWordsConstruct
            buttonOptions={wordsInOrder}
            notifyChoiceSelection={notifyChoiceSelection}
            incorrectAnswer={isCorrect}
            setIncorrectAnswer={setIsCorrect}
            handleShowSolution={handleShowSolution}
            toggleShow={toggleShow}
          />
        </div>
      )}

      {/*
      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={bookmarksToStudy[0].from}
        />
      </div>
      */
      }

      {isCorrect && <div>
        <h4>Original Sentence:</h4>
        <p>{originalText}</p>
      </div>}

      {!wordsMasterStatus && <LoadingAnimation />}
      {!isCorrect && (
        <OrderWordsInput
          buttonOptions={wordsMasterStatus}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={isCorrect}
          setIncorrectAnswer={setIsCorrect}
          handleShowSolution={handleShowSolution}
          toggleShow={toggleShow}
        />
      )}
      {!isCorrect && (
        <s.ItemRowCompactWrap className="ItemRowCompactWrap">
          <button onClick={handleReset}>{strings.reset}</button>
          <button onClick={handleCheck}>{strings.check}</button>
        </s.ItemRowCompactWrap>
      )}

      {isCorrect && (
        <NextNavigation
          api={api}
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
    </s.Exercise>
  );
}
