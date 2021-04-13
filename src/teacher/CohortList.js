import React, { useState, Fragment } from "react";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css"; //TODO move to an sc.js...
//import strings from "../i18n/definitions";
import { CohortItemCard } from "./CohortItemCard";
import { StyledButton, TopButton } from "./TeacherButtons.sc";
import CohortForm from "./CohortForm";

export default function CohortList({ api, cohorts, setForceUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const addCohort = (form) => {
    setIsError(false);
    api
      .createCohort(form)
      .then((result) => {
        setIsOpen(false);
        //TODO add system feedback to user here
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
        //TODO add system feedback to user here
        setIsError(true);
      });
  };


  return (
    <Fragment>
      <TopButton>
        <StyledButton primary onClick={() => setIsOpen(true)}>
          Add class (STRINGS)
        </StyledButton>
      </TopButton>
      {cohorts.map((cohort) => (
        <CohortItemCard key={cohort.id} cohort={cohort} />
      )).reverse()}
      {isOpen && (
        <Dialog onDismiss={() => setIsOpen(false)} aria-label="Create_class">
          <CohortForm
            onSubmit={addCohort}
            isError={isError}
          />
        </Dialog>
      )}
    </Fragment>
  );
}
