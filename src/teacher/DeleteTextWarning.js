import React from "react";
import { useHistory } from "react-router";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

const DeleteTextWarning = ({
  setShowDeleteTextWarning,
  articleTitle,
  articleID,
  deleteText
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
      <h1>Danger Zone!</h1>
      <p>You are about to delete your text STRINGS</p>
      <div className="name-box">
        <h2>{articleTitle}</h2>
      </div>
      <p>
        Please confirm that you wish to delete the text or press "Cancel".
        STRINGS
      </p>
      </div>
      <PopupButtonWrapper>
        <StyledButton primary onClick={handleCancel}>
          CancelSTRINGS
        </StyledButton>
        <StyledButton secondary onClick={handleDelete}>
          DeleteSTRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteTextWarning;