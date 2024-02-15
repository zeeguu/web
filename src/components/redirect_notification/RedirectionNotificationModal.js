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

  function handleCloseAndSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  //when user exits modal by clicking "X"
  function handleClose() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear redirectCheckbox state to avoid it prechecked when user re-enters the modal
  }

  //render modal based on the browser and device type
  function renderNotificatioModal() {
    let supportedBrowsers = (
      <SetupForSupportedBrowsers
        toggleRedirectCheckbox={toggleRedirectCheckbox}
        redirectCheckbox={redirectCheckbox}
        handleCloseAndSaveVisibilityPreferences={
          handleCloseAndSaveVisibilityPreferences
        }
        handleClose={handleClose}
        article={article}
      />
    );

    let unsupportedBrowsers = (
      <SetupForUnsupportedBrowsers
        toggleRedirectCheckbox={toggleRedirectCheckbox}
        redirectCheckbox={redirectCheckbox}
        handleModalVisibilityPreferences={handleModalVisibilityPreferences}
        handleCloseAndSaveVisibilityPreferences={
          handleCloseAndSaveVisibilityPreferences
        }
        handleClose={handleClose}
        handleCloseRedirectionModal={handleCloseRedirectionModal}
        article={article}
        api={api}
        setIsArticleSaved={setIsArticleSaved}
      />
    );

    if (runningInChromeDesktop() || runningInFirefoxDesktop()) {
      return supportedBrowsers;
    } else {
      return unsupportedBrowsers;
    }
  }

  return (
    <Modal open={open} onClose={handleCloseRedirectionModal}>
      <s.ModalWrapper>{renderNotificatioModal()}</s.ModalWrapper>
    </Modal>
  );
}
