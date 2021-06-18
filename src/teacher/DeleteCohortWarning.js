import React from "react";
import strings from "../i18n/definitions";
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
        <h1>{strings.dangerzone}</h1>
        <p>{strings.deleteCohortEnsurance}</p>
      </div>
      <CohortItemCard api={api} cohort={cohort} isWarning={true} />{" "}
      {isDeleteError && <Error message={strings.cannotDeleteClassWithText} />}
      <PopupButtonWrapper>
        <StyledButton primary onClick={handleCancel}>
          {strings.cancel}
        </StyledButton>
        <StyledButton secondary onClick={() => deleteCohort(cohort.id)}>
          {strings.removeFromList}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteCohortWarning;
