import React, { useState, useEffect } from "react";
import strings from "../../../i18n/definitions";
import CohortForm from "./CohortForm";
import { CohortItemCard } from "./CohortItemCard";
import LoadingAnimation from "../../../components/LoadingAnimation";
import {
  StyledButton,
  TopButtonWrapper,
} from "../../styledComponents/TeacherButtons.sc";
import AddTeacherDialog from "./AddTeacherDialog";

export default function CohortList({ cohorts, setForceUpdate }) {
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  const [reversedList, setReversedList] = useState(null);
  const [cohortToEdit, setCohortToEdit] = useState(null);

  //Making sure the latest added class is always on top of the list
  const getReversedList = cohorts.map((cohort) => cohort).reverse();

  useEffect(() => {
    setReversedList(getReversedList);
    // eslint-disable-next-line
  }, [cohorts]);

  const handleAddNewCohort = () => {
    setCohortToEdit(null);
    setShowCohortForm(true);
  };

  if (reversedList === null) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <TopButtonWrapper>
        <StyledButton primary onClick={handleAddNewCohort}>
          {strings.addClass}
        </StyledButton>
      </TopButtonWrapper>
      {reversedList.map((cohort) => (
        <CohortItemCard
          key={cohort.id}
          cohort={cohort}
          setShowCohortForm={setShowCohortForm}
          setShowAddTeacherDialog={setShowAddTeacherDialog}
          setCohortToEdit={setCohortToEdit}
        />
      ))}
      {showCohortForm && (
        <CohortForm
          setShowCohortForm={setShowCohortForm}
          setForceUpdate={setForceUpdate}
          cohort={cohortToEdit}
          cohorts={cohorts}
        />
      )}
      {showAddTeacherDialog && (
        <AddTeacherDialog
          cohort={cohortToEdit}
          setIsOpen={setShowAddTeacherDialog}
          setForceUpdate={setForceUpdate}
        />
      )}
    </>
  );
}
