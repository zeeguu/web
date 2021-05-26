import { Fragment } from "react";
import { v4 as uuid } from "uuid";

const NonStudiedWordsList = ({ words }) => {
  const exclusionReason = (word) =>{
    if (word.exclusionReason.includes("feedback")){
      return <p style={{margin: ".5em 0 0 1.2em", fontSize: "small", color:"green"}}>{word.exclusionReason}</p>
    }
    if (word.exclusionReason.includes("algorithm")){
      return <p style={{margin: ".5em 0 0 1.2em", fontSize: "small", color:"red"}}>{word.exclusionReason}</p>
    }
    return <p style={{margin: ".5em 0 0 1.2em", fontSize: "small", color:"#808080"}}>{word.exclusionReason}</p>
  }

  return (
    <Fragment>
      {words.map((word) => (
        <div key={word + uuid()}>
          {word.isStudied === "false" && (
            <div
              style={{
                borderLeft: "solid 3px #5492b3",
                marginBottom: "38px",
                minWidth: 270,
                userSelect: "none",
              }}
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
              {exclusionReason(word)}
            </div>
          )}
        </div>
      ))}
    </Fragment>
  );
};
export default NonStudiedWordsList;
