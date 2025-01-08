import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import NextNavigation from "../NextNavigation.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import BottomInput from "../BottomInput.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { removePunctuation } from "../../../utils/text/preprocessing";

// The user has to translate the L2 word in bold to their L1.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.translateL2toL1;

export default function TranslateL2toL1({
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
  const [messageToAPI, setMessageToAPI] = useState("");
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isBookmarkChanged, setIsBookmarkChanged] = useState(false);

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
    });
  }, [isBookmarkChanged]);

  function handleShowSolution(e, message) {
    e.preventDefault();
    let concatMessage;
    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }

    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setMessageToAPI(concatMessage);
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
    notifyCorrectAnswer(bookmarksToStudy[0]);
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

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="translateL2toL1">
      <div className="headlineWithMoreSpace">
        {strings.translateL2toL1Headline}
      </div>
      <BookmarkProgressBar
        bookmark={bookmarksToStudy[0]}
        message={messageToAPI}
      />
      {isCorrect && (
        <>
          <h1 className="wordInContextHeadline">
            {removePunctuation(bookmarksToStudy[0].to)}
          </h1>
        </>
      )}
      <div className="contextExample">
        <TranslatableText
          isCorrect={isCorrect}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          bookmarkToStudy={bookmarksToStudy[0].from}
          boldExpression={bookmarksToStudy[0].from}
        />
      </div>

      {!isCorrect && (
        <>
          <BottomInput
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            bookmarksToStudy={bookmarksToStudy}
            messageToAPI={messageToAPI}
            setMessageToAPI={setMessageToAPI}
            isL1Answer={true}
          />
        </>
      )}

      <NextNavigation
        exerciseType={EXERCISE_TYPE}
        message={messageToAPI}
        api={api}
        exerciseBookmark={bookmarksToStudy[0]}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={(e) => handleShowSolution(e, undefined)}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
        isBookmarkChanged={() => setIsBookmarkChanged(!isBookmarkChanged)}
      />
    </s.Exercise>
  );
}
