import React from "react"

const ExerciseType = ({source}) =>{
    switch (source) {
        case "MULTIPLE_CHOICE":
          return <p style={{marginTop:"0"}}>multiple choice</p>
        default:
          return <p style={{marginTop:"0"}}>recognise</p>;
      }
}
export default ExerciseType