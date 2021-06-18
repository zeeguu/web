import ExerciseDataCircle from "./ExerciseDataCircle";
import ExerciseDataItemCard from "./ExerciseDataItemCards";
import strings from "../i18n/definitions";

const WordCountCard = ({ isOpen, headline, wordCount }) => {
  return (
    <ExerciseDataItemCard isOpen={isOpen} headline={headline}>
      <ExerciseDataCircle
        circleText={strings.numberOfWords}
        circleData={wordCount}
      />
    </ExerciseDataItemCard>
  );
};
export default WordCountCard;
