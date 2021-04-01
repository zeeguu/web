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
          <br />
          <br />
          <Link to="/teacher/texts/AddTextsOption">
            <button>STRINGSAdd text</button>
          </Link>{" "}
          <button>STRINGAdd student</button>
          <br />
          <br />
          <Link
            to={`/teacher/classes/viewStudent/${studentID}/class/${cohortID}`}
          >
            The Student Name | progressbar | avg text length | avg text level |
            exercise correctness <button>X</button>
          </Link>
          <br />
          <br />
          ("Add student" and "X" will open a popup.)
        </p>
      </s.NarrowColumn>
    </>
  );
}
