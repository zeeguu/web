import Modal from "@mui/material/Modal";
import { useState } from "react";
import * as s from "../components/RedirectionNotificationModal.sc";
import { isMobile } from "../utils/misc/browserDetection";
import RedirectionNotificationForDesktop from "./RedirectionNotificationForDesktop";
import RedirectionNotificationForMobile from "./RedirectionNotificationForMobile";

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

  //saves modal visibility preferences to the Local Storage
  //ideally shared by mobile and desktop variant
  //temporarily not working on mobileg
  function handleModalVisibilityPreferences() {
    selectedDoNotShowRedirectionModal_Checkbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  return (
    <Modal open={open} onClose={handleCloseRedirectionModal}>
      <s.ModalWrapper>
        {!isMobile() ? (
          <RedirectionNotificationForDesktop
            toggleRedirectionCheckboxSelection={
              toggleRedirectionCheckboxSelection
            }
            selectedDoNotShowRedirectionModal_Checkbox={
              selectedDoNotShowRedirectionModal_Checkbox
            }
            setSelectedDoNotShowRedirectionModal_Checkbox={
              setSelectedDoNotShowRedirectionModal_Checkbox
            }
            article={article}
            handleModalVisibilityPreferences={handleModalVisibilityPreferences}
            handleCloseRedirectionModal={handleCloseRedirectionModal}
          />
        ) : (
          <RedirectionNotificationForMobile
            handleCloseRedirectionModal={handleCloseRedirectionModal}
            article={article}
            api={api}
            setIsArticleSaved={setIsArticleSaved}
          />
        )}
      </s.ModalWrapper>
    </Modal>
  );
}
