import React from "react";
import strings from "../i18n/definitions";
import { StyledButton, PopupButtonWrapper } from "./TeacherButtons.sc";
import { StyledDialog } from "./StyledDialog.sc";
import CohortItemCard from "./CohortItemCard";

const DeleteCohortWarning = ({ api, cohort, setShowWarning, deleteCohort }) => {
  return (
    <StyledDialog
      aria-label="Delete a class warning"
      onDismiss={() => setShowWarning(false)}
      max_width="530px"
    >
      <div className="centered">
        <h1>{strings.dangerzone}</h1>
        <p>{strings.deleteCohortEnsurance}</p>
      </div>
      <CohortItemCard api={api} cohort={cohort} isWarning={true} />
      <PopupButtonWrapper>
        <StyledButton primary onClick={() => setShowWarning(false)}>
          {strings.cancel}
        </StyledButton>
        <StyledButton secondary onClick={() => deleteCohort(cohort.id)}>
          {strings.delete}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteCohortWarning;
