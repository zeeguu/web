import { AttemptIcons } from "./AttemptIcons";
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
      <div style={{ display: "flex", flexDirection: "row", justifyContent:"flex-start", flexWrap:"wrap" }}>
        {words.map((word) => (
          <div
            style={{ borderLeft: "solid 3px #5492b3", marginBottom: "38px", minWidth:270}}
          >
            <p
              style={{
                color: "#44cdff",
                marginBottom: "-15px",
                marginTop: "0px",
                marginLeft: "1em",
              }}
            >
              {word.translation}
            </p>
            <p style={{ marginLeft: "1em", marginBottom: "-5px" }}>
              <b>{word.word}</b>
            </p>
            <div key={uuid()}>
              {word.exerciseAttempts.map((exercise) => (
                <div
                  key={uuid()}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "1em",
                    fontSize: "small",
                    marginBottom: "-25px",
                  }}
                >
                  <p style={{ color: "#808080" }}>{exercise.date}</p>
                  <p style={{ color: "#808080", marginLeft: ".5em" }}>
                    {exercise.type}
                  </p>
                  <AttemptIcons attemptString={exercise.attempts} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WordsDropDown;
