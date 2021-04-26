import React, { useState, Fragment, useEffect } from "react";
//import strings from "../i18n/definitions";
import CohortForm from "./CohortForm";
import { CohortItemCard } from "./CohortItemCard";
import LoadingAnimation from "../components/LoadingAnimation";
import { StyledButton, TopButtonWrapper } from "./TeacherButtons.sc";

export default function CohortList({ api, cohorts, setForceUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reversedList, setReversedList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //Making sure the latest added class is always on top of the list
  const getReversedList = () => {
    return cohorts.map((cohort) => cohort).reverse();
  };

  useEffect(() => {
    setReversedList(getReversedList());
    setIsLoading(false);
    // eslint-disable-next-line
  }, [cohorts]);

  return (
    <Fragment>
      <TopButtonWrapper>
        <StyledButton primary onClick={() => setIsOpen(true)}>
          Add class (STRINGS)
        </StyledButton>
      </TopButtonWrapper>
      {!isLoading ? (
        reversedList.map((cohort) => (
          <CohortItemCard
            api={api}
            key={cohort.id}
            cohort={cohort}
            setForceUpdate={setForceUpdate}
          />
        ))
      ) : (
        <LoadingAnimation />
      )}
      {isOpen && (
        <CohortForm
          api={api}
          setIsOpen={setIsOpen}
          setForceUpdate={setForceUpdate}
        />
      )}
    </Fragment>
  );
}
