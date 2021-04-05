import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { MdPeople } from "react-icons/md/";
import {StyledButton} from "./TeacherButtons.sc";
import * as s from "./CohortItemCard.sc";
import strings from "../i18n/definitions";

export const CohortItemCard = (/* { cohort } */) => {
  const cohortID = "HARDCODED";
  return (
    <s.StyledCohortItemCard>
      <div className="cohort-card">
      <Link to={`/teacher/classes/viewClass/${cohortID}`}>
        <div>
          <div className="top-line-box">
            <p className="font-light">
              {/* {cohort.language_name} */}Hardcoded
            </p>
            <p className="student-count">
              {/* {cohort.cur_students} */}10
              <MdPeople className="cohort-card-icon-people" size="22px" />
            </p>
          </div>
        </div>
        <h2 className="cohort-card-headline">
          {/* {cohort.name} */}English Class (STRINGS)
        </h2>
        </Link>
        <div className="buttom-box">
          <p className="font-light">
            {strings.inviteCode}: HARDCODED1234{/* {cohort.inv_code} */}
          </p>
          <div className="buttons-container">
            <Link to={`/teacher/classes/viewClass/${cohortID}`}>
              <StyledButton secondary>See students (STRINGS)</StyledButton>
            </Link>
              <StyledButton secondary>Edit class (STRINGS)</StyledButton>
          </div>
        </div>
      </div>
    </s.StyledCohortItemCard>
  );
};
export default CohortItemCard;
