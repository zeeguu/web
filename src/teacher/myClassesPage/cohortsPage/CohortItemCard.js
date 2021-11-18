import React, { Fragment, useEffect, useState } from "react";
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
  setShowAddTeacherDialog,
}) => {
  function handleEdit() {
    setCohortToEdit(cohort);
    setShowCohortForm(true);
  }

  function handleAddTeacher() {
    setCohortToEdit(cohort);
    setShowAddTeacherDialog(true);
  }

  return (
    <Fragment>
      <s.StyledCohortItemCard>
        <div className="cohort-card">
          <div className="cohort-info-column">
            <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
              <p className="light-font">
                {strings[cohort.language_name.toLowerCase()]}
              </p>
              <h2 className="cohort-card-headline">
                {cohort.name} {/*This cannot be localized*/}
              </h2>
              <div className="student-count-container">
                <p className="student-count">{cohort.cur_students}</p>
                <MdPeople size="22px" />
              </div>
              <p>
                {strings.inviteCode}: {cohort.inv_code}
              </p>
              <p className="light-font">
                {cohort.teachers_for_cohort.length > 1
                  ? strings.teachers
                  : strings.teacher}
              </p>
              {cohort.teachers_for_cohort.map((each) => (
                <p className="light-font" id="teacher-name">
                  {each.name}
                </p>
              ))}
            </Link>
          </div>
          {!isWarning && (
            <div className="button-column">
              <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
                <StyledButton secondary>{strings.seeStudents}</StyledButton>
              </Link>
              <div className="lower-buttons">
                <StyledButton secondary onClick={handleEdit}>
                  {strings.editClass}
                </StyledButton>
                <StyledButton secondary onClick={handleAddTeacher}>
                  Add Teacher***
                </StyledButton>
              </div>
            </div>
          )}
        </div>
      </s.StyledCohortItemCard>
    </Fragment>
  );
};
export default CohortItemCard;
