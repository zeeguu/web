import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import { useParams, Link } from "react-router-dom";

export default function ViewClass() {
  const cohortID = useParams().cohortID;
  const studentID = "StudentName(HARDCODED)";
  return (
    <>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{cohortID}</h1>
        </sc.TopTabs>
      </s.NarrowColumn>
      <Link to={`/teacher/classes/viewStudent/${studentID}/class/${cohortID}`}>View Student</Link>
    </>
  );
}
