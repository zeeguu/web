import React from "react";
//import strings from "../i18n/definitions";
import { StyledButton, PopupButtonWrapper } from "./TeacherButtons.sc";
import { StyledDialog } from "./StyledDialog.sc";
import CohortItemCard from "./CohortItemCard";
import { Error } from "./Error";

const DeleteCohortWarning = ({
  api,
  cohort,
  setShowWarning,
  deleteCohort,
  isDeleteError,
  setIsDeleteError,
  /* setIsLoading, */
}) => {
  const handleCancel = () => {
    setIsDeleteError(false);
    setShowWarning(false);
  };

  return (
    <StyledDialog
      aria-label="Delete a class warning"
      onDismiss={handleCancel}
      max_width="530px"
    >
      <div className="centered">
        <h1>Danger Zone! STRINGS</h1>
        <p>
          Are you sure you want to remove this class from your list? <br />
          This cannot be undone.STRINGS
        </p>
      </div>
      <CohortItemCard api={api} cohort={cohort} isWarning={true} />{" "}
      {isDeleteError && (
        <Error
          message={
            "Something went wrong. If you still share texts with this class, you cannot remove it from your list. Please, check that in 'My texts' and try again."
          }
          /* setLoading={setIsLoading} */
        />
      )}
      <PopupButtonWrapper>
        <StyledButton primary onClick={handleCancel}>
          Cancel STRINGS
        </StyledButton>
        <StyledButton secondary onClick={() => deleteCohort(cohort.id)}>
          Delete STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteCohortWarning;
