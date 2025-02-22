import OrderWords from "./OrderWords.js";

// Order words in the Learned Language
const EXERCISE_TYPE = "OrderWords_L2";

export default function OrderWordsL2({
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
  return (
    <>
      <OrderWords
        bookmarksToStudy={bookmarksToStudy}
        notifyCorrectAnswer={notifyCorrectAnswer}
        notifyIncorrectAnswer={notifyIncorrectAnswer}
        setExerciseType={setExerciseType}
        isCorrect={isCorrect}
        setIsCorrect={setIsCorrect}
        moveToNextExercise={moveToNextExercise}
        toggleShow={toggleShow}
        reload={reload}
        setReload={setReload}
        exerciseSessionId={exerciseSessionId}
        activeSessionDuration={activeSessionDuration}
        exerciseType={EXERCISE_TYPE}
      />
    </>
  );
}
