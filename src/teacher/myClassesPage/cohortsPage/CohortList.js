import React, { useState, useEffect } from "react";
import CohortForm from "./CohortForm";
import { CohortItemCard } from "./CohortItemCard";
import LoadingAnimation from "../../../components/LoadingAnimation";

// The rows carry no actions any more: "Add Class" is the page header's, and
// editing a class or adding a teacher to it happens inside the class. So all
// this list still owns is the new-class form the header opens.
export default function CohortList({
  cohorts,
  setForceUpdate,
  showCohortForm,
  setShowCohortForm,
}) {
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
        <CohortItemCard key={cohort.id} cohort={cohort} />
      ))}
      {showCohortForm && (
        <CohortForm
          setShowCohortForm={setShowCohortForm}
          setForceUpdate={setForceUpdate}
          cohort={null}
          cohorts={cohorts}
        />
      )}
    </>
  );
}
