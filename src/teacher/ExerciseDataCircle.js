import { StudentActivityDataCircle } from "./StudentActivityDataCircle.sc"

const ExerciseDataCircle = ({circleText, circleData})=>{
    return(
        <div className="circle-text-wrapper" style={{margin:".2em"}}>
        <p style={{ width:100 }}>
          {circleText}
        </p>
        <StudentActivityDataCircle style={{marginLeft:"auto", marginRight:"auto"}}>{circleData}</StudentActivityDataCircle>
      </div>
    )
}
export default ExerciseDataCircle;