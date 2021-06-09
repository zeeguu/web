import React from "react"

const ExerciseType = ({source}) =>{
    switch (source) {
        case "MULTIPLE_CHOICE":
          return <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>multiple choice</p>
        case "LEARNED":
          return <p style={{ color: "#808080", margin: "1em .5em 0 .5em" }}>Learned on:</p>
        default:
          return <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>recognise</p>;
      }
}
export default ExerciseType