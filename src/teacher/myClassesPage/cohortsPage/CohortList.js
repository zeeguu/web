import React, { useState, useEffect } from "react";
import CohortForm from "./CohortForm";
import { CohortItemCard } from "./CohortItemCard";
import LoadingAnimation from "../../../components/LoadingAnimation";
import AddTeacherDialog from "./AddTeacherDialog";

// The "Add Class" button lives in the page header now, so the form's open
// state is owned by Home and passed in; this list only ever opens the form for
// editing an existing class.
export default function CohortList({
  cohorts,
  setForceUpdate,
  showCohortForm,
  setShowCohortForm,
  cohortToEdit,
  setCohortToEdit,
}) {
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  const [reversedList, setReversedList] = useState(null);

  //Making sure the latest added class is always on top of the list
  const getReversedList = cohorts.map((cohort) => cohort).reverse();

  useEffect(() => {
    setReversedList(getReversedList);
    // eslint-disable-next-line
  }, [cohorts]);

  if (reversedList === null) {
    return <LoadingAnimation />;
  }

  return (
    <>
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
