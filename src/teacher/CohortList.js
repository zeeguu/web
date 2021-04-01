import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import { Link } from "react-router-dom";

export default function CohortList() {
  const cohortID = "ClassName(HARDCODED)";
  return (
    <>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{strings.myClasses}</h1>
        </sc.TopTabs>
        <p>
          <br />
          <button>STRINGSAdd class</button>
          <br />
          <br />
          <b>ClassName</b> <br /> ... languange, invite code, no of students
          everywhere...<br/>
      
        <Link to={`/teacher/classes/viewClass/${cohortID}`}>
          <button>STRINGSSee students' activity</button>
        </Link>{" "}
        <br />
        <button>STRINGSEdit class</button>
        <br/> 
        <br/>
        ("Add class" and "Edit class"opens popup.)
        </p>
      </s.NarrowColumn>
    </>
  );
}
