import { Fragment } from "react";
import { v4 as uuid } from "uuid";
import ExerciseType from "./ExerciseType";
import { formatedDateWithDay } from "./FormatedDate";

const LearnedWordsList = ({ words }) => {
  return (
    <Fragment>
      {words.length===0 && <p style={{fontSize:"medium"}}>The student has not learned any words yet. STRINGS</p>}
      {words.map((word) => (
        <div key={uuid() + word}>
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
              {word.translation.toLowerCase()}
            </p>
            <p style={{ marginLeft: "1em", marginBottom: "-5px" }}>
              <b>{word.word}</b>
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "1em",
                fontSize: "small",
                marginBottom: "-25px",
              }}
            >
              <ExerciseType source="LEARNED" />
              <p style={{ color: "#808080" }}>
                {formatedDateWithDay(word.learned_time)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
};
export default LearnedWordsList;
