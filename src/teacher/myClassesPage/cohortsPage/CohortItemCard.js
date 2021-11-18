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
  const [cohortTeacherNames, setCohortTeacherNames] = useState("");

  useEffect(() => {
    updateCohortTeacherNames();
    //eslint-disable-next-line
  }, [cohort]);

  function handleEdit() {
    setCohortToEdit(cohort);
    setShowCohortForm(true);
  }

  function updateCohortTeacherNames() {
    const teacherNames = cohort.teachers_for_cohort.map((each) => each.name);
    const teacherNameList = teacherNames.join(",");
    setCohortTeacherNames(teacherNameList);
  }

  function handleAddTeacher() {
    setCohortToEdit(cohort);
    setShowAddTeacherDialog(true);
  }

  return (
    <Fragment>
      <s.StyledCohortItemCard>
        <div className="cohort-card">
          <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
            <div>
              <div className="space-between-container">
                <p className="font-light">
                  {strings[cohort.language_name.toLowerCase()]}
                </p>
              </div>
            </div>
            <h2 className="cohort-card-headline">
              {cohort.name} {/*This cannot be localized*/}
            </h2>
            <p className="student-count">
              {cohort.cur_students}
              <MdPeople className="cohort-card-icon-people" size="22px" />
            </p>
          </Link>
          <p className="font-lightk">
            {strings.inviteCode}: {cohort.inv_code}
          </p>
          <p className="font-light">
            {cohort.teachers_for_cohort.length > 1
              ? strings.teachers
              : strings.teacher}{" "}
            <br />
            {cohortTeacherNames}
          </p>

          {!isWarning && (
            <div className="buttons-container">
              <StyledButton secondary onClick={handleEdit}>
                {strings.editClass}
              </StyledButton>

              <StyledButton secondary onClick={handleAddTeacher}>
                Add teacher*
              </StyledButton>
              <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
                <StyledButton secondary>{strings.seeStudents}</StyledButton>
              </Link>
            </div>
          )}
        </div>
      </s.StyledCohortItemCard>
    </Fragment>
  );
};
export default CohortItemCard;
