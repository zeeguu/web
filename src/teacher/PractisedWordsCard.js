import ExerciseDataCircle from "./ExerciseDataCircle";
import ExerciseDataItemCard from "./ExerciseDataItemCards";

const PractisedWordsCard = ({ time, wordCount, correctness, isOpen }) => {
    //TODO everything here should be localised! STRINGS 
  return (
    <ExerciseDataItemCard isOpen={isOpen} headline="Practised words">
      <ExerciseDataCircle circleText="time spent on exercises" circleData={time}/>
      <ExerciseDataCircle circleText="number of words" circleData={wordCount}/>
      <ExerciseDataCircle circleText="solved on 1st attempt" circleData={correctness}/>
    </ExerciseDataItemCard>
  );
};
export default PractisedWordsCard;
