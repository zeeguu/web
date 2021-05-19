import ExerciseDataCircle from "./ExerciseDataCircle";
import ExerciseDataItemCard from "./ExerciseDataItemCards";

const PractisedWordsCard = ({ time, wordCount, correctness }) => {
    //TODO everything here should be localised! STRINGS 
  return (
    <ExerciseDataItemCard headline="Practised words">
      <ExerciseDataCircle circleText="time spent on exercise" circleData={time}/>
      <ExerciseDataCircle circleText="number of words" circleData={wordCount}/>
      <ExerciseDataCircle circleText="solved on 1st attempt" circleData={correctness}/>
    </ExerciseDataItemCard>
  );
};
export default PractisedWordsCard;
