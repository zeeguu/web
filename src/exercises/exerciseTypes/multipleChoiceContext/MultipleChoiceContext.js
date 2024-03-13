import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";

import strings from "../../../i18n/definitions";
import NextNavigation from "../NextNavigation";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { tokenize } from "../../../utils/preprocessing/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/preprocessing/preprocessing";

const EXERCISE_TYPE = "Select_L2T_fitting_L1W";
export default function MultipleChoiceContext({
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
  exerciseSessionId,
  activeSessionDuration,
}) {
  const [messageToAPI, setMessageToAPI] = useState("");
  const [articleInfo, setArticleInfo] = useState(null);
  const [interactiveText, setInteractiveText] = useState(null);
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [contextOptions, setContextOptions] = useState(null);
  const [distractorWords, setDistractorWords] = useState([]);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
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
      setArticleInfo(articleInfo);
      generateContextOptions(bookmarksToStudy[0].context);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleShowSolution(e, message) {
    if (e) {
      e.preventDefault();
    }
    let concatMessage;

    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }
    setMessageToAPI(concatMessage);
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    console.log(activeSessionDuration);
    api.uploadExerciseFinalizedData(
      concatMessage,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    correctAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function handleIncorrectAnswer() {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(bookmarksToStudy[0]);
  }

  function generateContextOptions(context) {
    const sentences = articleInfo.content.split(/[.!?]/).filter(sentence => sentence.trim() !== '');
    const selectedSentences = [];
    const selectedIndices = []; //to make sure no sentence is selected twice
    const distractorWords = [];

    // Remove the sentence containing the bookmark
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (sentence.includes(bookmarksToStudy[0].from)) {
            sentences.splice(i, 1);
            break;
        }
    }

    // Select two more random sentences
    while (selectedSentences.length < 2 && sentences.length > 0) {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        if(!selectedIndices.includes(randomIndex)){
            const selectedSentence = sentences[randomIndex].trim();
            selectedSentences.push(selectedSentence);
            selectedIndices.push(randomIndex);
        }
    }

    // Pick a random word from each selected sentence
    selectedSentences.forEach(sentence => {
        const words = sentence.split(/\s+|,/).filter(word => word.trim() !== ''); // Exclude empty strings and commas
        if (words.length > 0) {
            const randomWordIndex = Math.floor(Math.random() * words.length);
            distractorWords.push(words[randomWordIndex]);
            if (distractorWords.indexOf(words[randomWordIndex]) === -1) {
                distractorWords.push(words[randomWordIndex]);
            }
        }
    });

    // Shuffle the options to randomize their order
    const shuffledOptions = shuffle([context, ...selectedSentences])
    setContextOptions(shuffledOptions);
    setDistractorWords(distractorWords);
  }

  if (!articleInfo || !interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="findWordInContext">
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceContextHeadline}
      </div>
      <h1 className="wordInContextHeadline">{bookmarksToStudy[0].from}</h1>
      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          bookmarkToStudy={bookmarksToStudy[0].from}
          exerciseType={EXERCISE_TYPE}
          wordOptions={contextOptions}
        />
      </div>
      <NextNavigation
        message={messageToAPI}
        api={api}
        bookmarksToStudy={bookmarksToStudy}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={(e) => handleShowSolution(e, undefined)}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}
