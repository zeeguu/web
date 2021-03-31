import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import { useParams, Link } from "react-router-dom";

export default function StudentsActivityOverview() {
  const cohortID = useParams().cohortID;
  const studentID = "StudentName(HARDCODED)";
  return (
    <>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{cohortID}</h1>
        </sc.TopTabs>
        <p>
          Here, the list of the students and their activity will be rendered... <br />
          <br />
          There will be two buttons on the top:<br/>
          <Link>Add text</Link> which will route us to the AddText page<br/>
          and<br/>
          <b>Add student</b> which will open a popup.<br/><br/>
          For each student there will be two options for clicking:<br/>
          <br />
          <Link
            to={`/teacher/classes/viewStudent/${studentID}/class/${cohortID}`}
          >
            The Student Name | progressbar | avg text length | avg text level | exercise correctness 
          </Link><br/>
          
          which will take us to the ActivityInsightsRouter and thereby to the Reading-/ExercisesInsights.
          <br /><br/>
          and
          <br />
          <br />
          <b>The delete icon</b> to the right of the student, which will open a
          popup delete warning.
        </p>
      </s.NarrowColumn>
    </>
  );
}
