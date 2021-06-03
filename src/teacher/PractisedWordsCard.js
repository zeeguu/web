import strings from "../i18n/definitions";
import ExerciseDataCircle from "./ExerciseDataCircle";
import ExerciseDataItemCard from "./ExerciseDataItemCards";

const PractisedWordsCard = ({ time, wordCount, correctness, isOpen }) => {
  return (
    <ExerciseDataItemCard isOpen={isOpen} headline={strings.practisedWords}>
      <ExerciseDataCircle
        circleText={strings.timeSpendOnExercises}
        circleData={time}
      />
      <ExerciseDataCircle
        circleText={strings.numberOfWords}
        circleData={wordCount}
      />
      <ExerciseDataCircle
        circleText={strings.solvedOnFirstAttempt}
        circleData={correctness}
      />
    </ExerciseDataItemCard>
  );
};
export default PractisedWordsCard;
