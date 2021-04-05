import React from "react";
import { Link } from "react-router-dom";
import { MdPeople } from "react-icons/md/";
import { StyledButton } from "./TeacherButtons.sc";
import * as s from "./CohortItemCard.sc";
import strings from "../i18n/definitions";
import { cohort } from "./DummyCohort";

export const CohortItemCard = (/* { cohort } */) => {
  return (
    <s.StyledCohortItemCard>
      <div className="cohort-card">
        <Link to={`/teacher/classes/viewClass/${cohort.cohortID}`}>
          <div>
            <div className="top-line-box">
              <p className="font-light">{cohort.language_name}</p>
              <p className="student-count">
                {cohort.cur_students}
                <MdPeople className="cohort-card-icon-people" size="22px" />
              </p>
            </div>
          </div>
          <h2 className="cohort-card-headline">
            {cohort.name} {/*This cannot be strings-yfied*/}
          </h2>
        </Link>
        <div className="buttom-box">
          <p className="font-light">
            {strings.inviteCode}: {cohort.inv_code}
          </p>
          <div className="buttons-container">
            <Link to={`/teacher/classes/viewClass/${cohort.cohortID}`}>
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
