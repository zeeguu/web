import React from "react";
import strings from "../../../i18n/definitions";
import {
  StyledButton,
  PopupButtonWrapper,
} from "../../styledComponents/TeacherButtons.sc";
import { StyledDialog } from "../../styledComponents/StyledDialog.sc";
import CohortItemCard from "./CohortItemCard";
import { Error } from "../../sharedComponents/Error";

const DeleteCohortWarning = ({
  cohort,
  setShowWarning,
  deleteCohort,
  isDeleteError,
  setIsDeleteError,
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
      </div>
      <CohortItemCard cohort={cohort} isWarning={true} />
      <p>{strings.deleteCohortEnsurance}</p>
      {isDeleteError && <Error message={strings.cannotDeleteClassWithText} />}
      {cohort.teachers_for_cohort.length > 1 && (
        <b>
          <Error message={strings.youAreSharingThisClassWarning} />
        </b>
      )}
      <PopupButtonWrapper>
        <StyledButton primary onClick={handleCancel}>
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
