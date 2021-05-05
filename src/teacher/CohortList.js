import React, { useState, Fragment, useEffect } from "react";
//import strings from "../i18n/definitions";
import CohortForm from "./CohortForm";
import { CohortItemCard } from "./CohortItemCard";
import LoadingAnimation from "../components/LoadingAnimation";
import { StyledButton, TopButtonWrapper } from "./TeacherButtons.sc";

export default function CohortList({ api, cohorts, setForceUpdate }) {
  const [showCohortForm, setShowCohortForm] = useState(false);
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
    <Fragment>
      <TopButtonWrapper>
        <StyledButton primary onClick={handleAddNewCohort}>
          Add class (STRINGS)
        </StyledButton>
      </TopButtonWrapper>
      {reversedList.map((cohort) => (
        <CohortItemCard
          key={cohort.id}
          cohort={cohort}
          setShowCohortForm={setShowCohortForm}
          setCohortToEdit={setCohortToEdit}
        />
      ))}
      {showCohortForm && (
        <CohortForm
          api={api}
          setShowCohortForm={setShowCohortForm}
          setForceUpdate={setForceUpdate}
          cohort={cohortToEdit}
        />
      )}
    </Fragment>
  );
}
