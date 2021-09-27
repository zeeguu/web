import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { MdPeople } from "react-icons/md/";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import * as s from "../../styledComponents/CohortItemCard.sc";
import strings from "../../../i18n/definitions";

export const CohortItemCard = ({
  cohort,
  isWarning,
  setShowCohortForm,
  setCohortToEdit,
}) => {
  const handleEdit = () => {
    setCohortToEdit(cohort);
    setShowCohortForm(true);
  };

  return (
    <Fragment>
      <s.StyledCohortItemCard>
        <div className="cohort-card">
          <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
            <div>
              <div className="top-line-box">
                <p className="font-light">{strings[cohort.language_name.toLowerCase()]}</p>
                <p className="student-count">
                  {cohort.cur_students}
                  <MdPeople className="cohort-card-icon-people" size="22px" />
                </p>
              </div>
            </div>
            <h2 className="cohort-card-headline">
              {cohort.name} {/*This cannot be localized*/}
            </h2>
          </Link>
          <div className="bottom-box">
            <p className="font-light">
              {strings.inviteCode}: {cohort.inv_code}
            </p>
            {!isWarning && (
              <div className="buttons-container">
                <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
                  <StyledButton secondary>{strings.seeStudents}</StyledButton>
                </Link>
                <StyledButton secondary onClick={handleEdit}>
                  {strings.editClass}
                </StyledButton>
              </div>
            )}
          </div>
        </div>
      </s.StyledCohortItemCard>
    </Fragment>
  );
};
export default CohortItemCard;
