import { Fragment } from "react";
import { AttemptIcons } from "./AttemptIcons";
import { v4 as uuid } from "uuid";

const LearnedWordsList = ({ words }) => {
  return (
    <Fragment>
      {words.map((word) => (
        <div key={uuid()+word}>
          {word.isLearned === "true" && (
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

              {word.exerciseAttempts.map((exercise) => (
                <div>
                  {exercise.attempts.length === 1 &&
                    exercise.attempts[0] === "c" && (
                      <div
                        key={uuid()+exercise.type}
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
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </Fragment>
  );
};
export default LearnedWordsList;
