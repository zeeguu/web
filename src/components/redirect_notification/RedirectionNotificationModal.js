import Modal from "@mui/material/Modal";
import { useState } from "react";
import * as s from "./RedirectionNotificationModal.sc";
import {
  runningInFirefoxDesktop,
  runningInChromeDesktop,
} from "../../utils/misc/browserDetection";
import SetupForSupportedBrowsers from "./SetupForSupportedBrowsers";
import SetupForUnsupportedBrowsers from "./SetupForUnsupportedBrowsers";

//This modal is used in the ArticlePreview component

export default function RedirectionNotificationModal({
  api,
  article,
  open,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  setIsArticleSaved, // related to the article's state
}) {
  const [redirectCheckbox, setRedirectCheckbox] = useState(false);

  function toggleRedirectCheckbox() {
    setRedirectCheckbox(!redirectCheckbox);
  }

  //this state is saved to local storage
  function handleModalVisibilityPreferences() {
    redirectCheckbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  //when user enters article or saves it
  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  //when user exits modal by clicking "X"
  function handleClose() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state to avoid it being prechecked when the user re-enters the modal
  }

  //render modal based on the browser and device type
  function renderNotificatioModal() {
    let setupForSupportedBrowsers = (
      <SetupForSupportedBrowsers
        toggleRedirectCheckbox={toggleRedirectCheckbox}
        redirectCheckbox={redirectCheckbox}
        handleSaveVisibilityPreferences={handleSaveVisibilityPreferences}
        handleClose={handleClose}
        article={article}
      />
    );

    let setupForUnsupportedBrowsers = (
      <SetupForUnsupportedBrowsers
        toggleRedirectCheckbox={toggleRedirectCheckbox}
        redirectCheckbox={redirectCheckbox}
        handleModalVisibilityPreferences={handleModalVisibilityPreferences}
        handleSaveVisibilityPreferences={handleSaveVisibilityPreferences}
        handleClose={handleClose}
        handleCloseRedirectionModal={handleCloseRedirectionModal}
        article={article}
        api={api}
        setIsArticleSaved={setIsArticleSaved}
      />
    );

    if (runningInChromeDesktop() || runningInFirefoxDesktop()) {
      return setupForSupportedBrowsers;
    } else {
      return setupForUnsupportedBrowsers;
    }
  }

  return (
    <Modal open={open} onClose={handleCloseRedirectionModal}>
      <s.ModalWrapper>{renderNotificatioModal()}</s.ModalWrapper>
    </Modal>
  );
}
