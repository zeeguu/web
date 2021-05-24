import { Fragment } from "react";
import { v4 as uuid } from "uuid";

const NonStudiedWordsList = ({ words }) => {
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
            </div>
          )}
        </div>
      ))}
    </Fragment>
  );
};
export default NonStudiedWordsList;
