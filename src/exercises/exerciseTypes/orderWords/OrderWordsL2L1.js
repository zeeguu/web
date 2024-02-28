import OrderWords from "./OrderWords.js";

const EXERCISE_TYPE = "OrderWords_L1T_from_L2T";

export default function OrderWordsL2L1({
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
}) {
  return (
    <>
      <OrderWords
        key={currentIndex}
        bookmarksToStudy={bookmarksToStudy}
        correctAnswer={correctAnswer}
        notifyIncorrectAnswer={notifyIncorrectAnswer}
        api={api}
        setExerciseType={setExerciseType}
        isCorrect={isCorrect}
        setIsCorrect={setIsCorrect}
        moveToNextExercise={moveToNextExercise}
        toggleShow={toggleShow}
        reload={reload}
        setReload={setReload}
        exerciseSessionId={exerciseSessionId}
        exerciseType={EXERCISE_TYPE}
      />
    </>
  );
}
