import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";

import NextNavigation from "../NextNavigation";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";

// The user has to select the correct L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoice;

export default function MultipleChoice({
  api,
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
  activeSessionDuration,
}) {
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [messageToAPI, setMessageToAPI] = useState("");
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.wordsSimilarTo(bookmarksToStudy[0].id, (words) => {
      consolidateChoiceOptions(words);
    });
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
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBookmarkChanged]);

  function notifyChoiceSelection(selectedChoice) {
    console.log("checking result...");
    if (
      selectedChoice ===
      removePunctuation(bookmarksToStudy[0].from.toLowerCase())
    ) {
      notifyCorrectAnswer(bookmarksToStudy[0]);
      setIsCorrect(true);
      let concatMessage = messageToAPI + "C";
      handleAnswer(concatMessage);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(bookmarksToStudy[0]);
      let concatMessage = messageToAPI + "W";
      setMessageToAPI(concatMessage);
    }
  }

  function handleShowSolution() {
    let message = messageToAPI + "S";
    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    handleAnswer(message);
  }

  function handleAnswer(message) {
    setMessageToAPI(message);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      removePunctuation(bookmarksToStudy[0].from.toLowerCase()),
      removePunctuation(similarWords[firstRandomInt].toLowerCase()),
      removePunctuation(similarWords[secondRandomInt].toLowerCase()),
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);
    setButtonOptions(shuffledListOfOptions);
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      <div className="headlineWithMoreSpace">
        {strings.chooseTheWordFittingContextHeadline}
      </div>
      <BookmarkProgressBar
        bookmark={bookmarksToStudy[0]}
        message={messageToAPI}
      />

      {isCorrect && <h1>{removePunctuation(bookmarksToStudy[0].to)}</h1>}

      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={bookmarksToStudy[0].from}
          exerciseType={EXERCISE_TYPE}
        />
      </div>

      {!buttonOptions && <LoadingAnimation />}
      {!isCorrect && (
        <MultipleChoicesInput
          buttonOptions={buttonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
          setIncorrectAnswer={setIncorrectAnswer}
          handleShowSolution={handleShowSolution}
          toggleShow={toggleShow}
        />
      )}
      <NextNavigation
        exerciseType={EXERCISE_TYPE}
        message={messageToAPI}
        api={api}
        exerciseBookmark={bookmarksToStudy[0]}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
        isBookmarkChanged={() => setIsBookmarkChanged(!isBookmarkChanged)}
      />
    </s.Exercise>
  );
}
