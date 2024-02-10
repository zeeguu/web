import Modal from "@mui/material/Modal";
import { useState } from "react";
import * as s from "../components/RedirectionNotificationModal.sc";
import {
  isMobile,
  runningInFirefoxDesktop,
  runningInChromeDesktop,
} from "../utils/misc/browserDetection";
import RedirectionNotificationForDesktop from "./RedirectionNotificationForDesktop";
import RedirectionNotificationForMobile from "./RedirectionNotificationForMobile";
import RedirectionNotificationForSafari from "./RedirectionNotificationForSafari";

//This modal is used in the ArticlePreview component

export default function RedirectionNotificationModal({
  api,
  article,
  open,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  setIsArticleSaved, // related to the article's state
}) {
  const [
    selectedDoNotShowRedirectionModal_Checkbox,
    setSelectedDoNotShowRedirectionModal_Checkbox,
  ] = useState(false);

  function toggleRedirectionCheckboxSelection() {
    setSelectedDoNotShowRedirectionModal_Checkbox(
      !selectedDoNotShowRedirectionModal_Checkbox
    );
  }

  function handleModalVisibilityPreferences() {
    selectedDoNotShowRedirectionModal_Checkbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  function handleCloseAndSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  //when user exits modal by clicking "X"
  function handleCloseWithoutSavingVisibilityPreferences() {
    handleCloseRedirectionModal();
    setSelectedDoNotShowRedirectionModal_Checkbox(false); //to avoid prechecked checkboxes
  }

  //render modal based on the browser
  function renderNotificatioModal() {
    let redirectionNotificationForDesktop = (
      <RedirectionNotificationForDesktop
        toggleRedirectionCheckboxSelection={toggleRedirectionCheckboxSelection}
        selectedDoNotShowRedirectionModal_Checkbox={
          selectedDoNotShowRedirectionModal_Checkbox
        }
        handleCloseAndSaveVisibilityPreferences={
          handleCloseAndSaveVisibilityPreferences
        }
        handleCloseWithoutSavingVisibilityPreferences={
          handleCloseWithoutSavingVisibilityPreferences
        }
        article={article}
      />
    );

    let redirectionNotificationForMobile = (
      <RedirectionNotificationForMobile
        toggleRedirectionCheckboxSelection={toggleRedirectionCheckboxSelection}
        selectedDoNotShowRedirectionModal_Checkbox={
          selectedDoNotShowRedirectionModal_Checkbox
        }
        handleModalVisibilityPreferences={handleModalVisibilityPreferences}
        handleCloseAndSaveVisibilityPreferences={
          handleCloseAndSaveVisibilityPreferences
        }
        handleCloseWithoutSavingVisibilityPreferences={
          handleCloseWithoutSavingVisibilityPreferences
        }
        handleCloseRedirectionModal={handleCloseRedirectionModal}
        article={article}
        api={api}
        setIsArticleSaved={setIsArticleSaved}
      />
    );

    let redirectionNotificationForSafari = (
      <RedirectionNotificationForSafari
        toggleRedirectionCheckboxSelection={toggleRedirectionCheckboxSelection}
        selectedDoNotShowRedirectionModal_Checkbox={
          selectedDoNotShowRedirectionModal_Checkbox
        }
        handleModalVisibilityPreferences={handleModalVisibilityPreferences}
        handleCloseAndSaveVisibilityPreferences={
          handleCloseAndSaveVisibilityPreferences
        }
        handleCloseWithoutSavingVisibilityPreferences={
          handleCloseWithoutSavingVisibilityPreferences
        }
        handleCloseRedirectionModal={handleCloseRedirectionModal}
        article={article}
        api={api}
        setIsArticleSaved={setIsArticleSaved}
      />
    );

    if (runningInChromeDesktop() || runningInFirefoxDesktop()) {
      return redirectionNotificationForDesktop;
    } else if (isMobile()) {
      return redirectionNotificationForMobile;
    } else {
      return redirectionNotificationForSafari;
    }
  }

  return (
    <Modal open={open} onClose={handleCloseRedirectionModal}>
      <s.ModalWrapper>{renderNotificatioModal()}</s.ModalWrapper>
    </Modal>
  );
}
