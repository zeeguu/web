import OrderWords from "./OrderWords.js";

const EXERCISE_TYPE = "OrderWords_L2T_from_L1T";

export default function OrderWordsL2({
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

  return (
    <>
      <OrderWords
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
