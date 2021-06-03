import React from "react";
import strings from "../i18n/definitions";
import { useHistory } from "react-router";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

const DeleteTextWarning = ({
  setShowDeleteTextWarning,
  articleTitle,
  deleteText,
}) => {
  const history = useHistory();

  const handleCancel = () => {
    setShowDeleteTextWarning(false);
  };
  const handleDelete = () => {
    deleteText();
    setShowDeleteTextWarning(false);
  };

  return (
    <StyledDialog
      onDismiss={() => setShowDeleteTextWarning(false)}
      aria-label="Create class"
      max_width="625px"
    >
      <div className="centered">
        <h1>{strings.dangerzone}</h1>
        <p>{strings.deleteTextWarning}</p>
        <div className="name-box">
          <h2>{articleTitle}</h2>
        </div>
        <p>{strings.confirmDeleteText}</p>
      </div>
      <PopupButtonWrapper>
        <StyledButton primary onClick={handleCancel}>
          {strings.cancel}
        </StyledButton>
        <StyledButton secondary onClick={handleDelete}>
          {strings.delete}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteTextWarning;
