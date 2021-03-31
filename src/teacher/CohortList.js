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
          Here, the list of the teacher's classes will be rendered... <br /><br/>
          There will be three buttons to click: <br/>
        <b>Add Class</b> op the top, which will open a popup <br/><br/>
        Inside each class there will be two buttons:<br/>
        <Link to={`/teacher/classes/viewClass/${cohortID}`}>
          See Students' Activity
        </Link> which will take us to the student activity overview.<br/>
        And<br/>
        <b>Edit Class</b> which will open a popup <br/>
        
        </p>
      </s.NarrowColumn>
    </>
  );
}
