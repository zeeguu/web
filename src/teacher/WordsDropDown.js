import PractisedWordsList from "./PractisedWordsList";
import LearnedWordsList from "./LearnedWordsList";
import NonStudiedWordsList from "./NonStudiedWordsList";

const WordsDropDown = ({ words, card }) => {
  const setHeadline = () => {
    console.log(card)
    switch (card) {
      case "non-studied":
        return "Words translated by the student that will never be studied in Zeeguu STRINGS";
      case "learned":
        return "Word practised correctly on four DIFFERENT days STRINGS";
      default:
        return "Practised words - translated and exercised by the student STRINGS";
    }
  };

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
      <h3 style={{ color: "#5492b3" }}>{setHeadline()}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
          {card==="practised" && <PractisedWordsList words={words}/>}
          {card==="learned" && <LearnedWordsList words={words}/> }
          {card==="non-studied" && <NonStudiedWordsList words={words}/> }
      </div>
    </div>
  );
};
export default WordsDropDown;
