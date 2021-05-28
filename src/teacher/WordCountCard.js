import ExerciseDataCircle from "./ExerciseDataCircle";
import ExerciseDataItemCard from "./ExerciseDataItemCards";

const WordCountCard = ({isOpen, headline, wordCount})=>{
       //TODO everything here should be localised! STRINGS 
    return (
        <ExerciseDataItemCard isOpen={isOpen} headline={headline}>
          <ExerciseDataCircle circleText="number of words" circleData={wordCount}/>
        </ExerciseDataItemCard>
      );
    };
    export default WordCountCard;