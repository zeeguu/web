import { CorrectAttempt, HintUsed, SolutionShown, WrongAttempt } from "./StudentExerciseAttemptIcons";
import { v4 as uuid } from "uuid";

const WordsDropDown = ({ headline, words }) => {
  return (
    <div
      style={{
        padding: 20,
        width: "95%",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: "#5492b3" }}>{headline}</h3>
      {words.map((word) => (
        <>
      <p style={{color:"#44cdff", marginBottom:"-15px"}}>{word.translation}</p>
        <div key={uuid()} style={{display:"flex", flexDirection:"row"}} >
          <p>{word.word}</p>
          <HintUsed />
          <CorrectAttempt/>
          <CorrectAttempt/>
          <WrongAttempt/>
          <SolutionShown/>
          <CorrectAttempt/>
          <WrongAttempt/>
          <HintUsed/>
          <CorrectAttempt/>
          <SolutionShown/>
          <HintUsed/>
          <SolutionShown/>
          <SolutionShown/>
        </div>
        </>
      ))}
    </div>
  );
};
export default WordsDropDown;
