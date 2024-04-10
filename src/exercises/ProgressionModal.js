import { useState } from "react";
import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Body from "./modal_shared/Body";
import Footer from "./modal_shared/Footer";
import Checkbox from "./modal_shared/Checkbox";
import strings from "../i18n/definitions";
import * as s from "../RedirectionNotificationModal.sc";

export default function ProgressionModal({open, onClose}) {
  const [redirectCheckbox, setRedirectCheckbox] = useState(false);

  function toggleRedirectCheckbox() {
    setRedirectCheckbox(!redirectCheckbox);
  }

  //this state is saved to local storage
  function handleModalVisibilityPreferences() {
    preferenceCheckbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  //runs when user enters article or saves it
  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>{strings.learningCycleCongrats}</Header>
      <Body>
        <p>{strings.learningCycleExplanation}</p>
      </Body>
      <Footer>
        <Checkbox
            label={strings.optOutProductiveKnowledge}
            checked={preferenceCheckbox}
            onChange={toggleRedirectCheckbox}
        />
        <Checkbox
            label={strings.dontShowMsg}
            checked={preferenceCheckbox}
            onChange={toggleRedirectCheckbox}
        />
        <s.CloseButton
            onClick={onClose}
          >
            Back to the Exercises
        </s.CloseButton>
      </Footer>
    </Modal>
  );
}
