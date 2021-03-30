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
      </s.NarrowColumn>
      <Link to={`/teacher/classes/viewClass/${cohortID}`}>View Class</Link>
    </>
  );
}
