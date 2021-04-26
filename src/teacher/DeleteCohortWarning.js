import React from "react";
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
      <h1>Danger Zone! STRINGS</h1>
      <p>
        Are you sure you want to delete this class? This cannot be undone.
        STRINGS
      </p>
      </div>
      <CohortItemCard api={api} cohort={cohort} isWarning={true} />
      <PopupButtonWrapper>
        <StyledButton primary onClick={() => setShowWarning(false)}>
          Cancel STRINGS
        </StyledButton>
        <StyledButton secondary onClick={()=>deleteCohort(cohort.id)}>
          Delete STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteCohortWarning;
