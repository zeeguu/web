import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import { Link } from "react-router-dom";
import { CohortItemCard } from "./CohortItemCard";
import { StyledButton, TopButton } from "./TeacherButtons.sc";

export default function CohortList() {
  const cohortID = "ClassName(HARDCODED)";

  return (
    <>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{strings.myClasses}</h1>
        </sc.TopTabs>
        <TopButton>
          <StyledButton primary>Add class (STRINGS)</StyledButton>
        </TopButton>
        <CohortItemCard />
        <p>
          <br />
          ("Add class" and "Edit class"opens popup.)
        </p>
      </s.NarrowColumn>
    </>
  );
}
