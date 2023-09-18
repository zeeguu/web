import Modal from "@mui/material/Modal";
import * as s from "../components/RedirectionNotificationModal.sc";
import { isMobile } from "../utils/misc/browserDetection";
import RedirectionNotificationForDesktop from "./RedirectionNotificationForDesktop";
import RedirectionNotificationForMobile from "./RedirectionNotificationForMobile";

//This modal is used in the ArticlePreview component

//TODO: Further refactor, e.g after testing and making sure users
//understand text and wording, turn strings into variables and move to definitions.js

export default function RedirectionNotificationModal({
  api,
  article,
  open,
  handleClose,
  selectedDoNotShowRedirectionModal_Checkbox,
  setSelectedDoNotShowRedirectionModal_Checkbox,
  setDoNotShowRedirectionModal_UserPreference, // derived from selectedDoNotShowRedirectionModal_Checkbox
  setIsArticleSaved, // related to the article's state
}) {
  function toggleRedirectionCheckboxSelection() {
    setSelectedDoNotShowRedirectionModal_Checkbox(
      !selectedDoNotShowRedirectionModal_Checkbox
    );
  }

  //saves modal visibility preferences to the Local Storage
  //ideally shared by mobile and desktop variant
  //temporarily not working for mobile
  function handleModalUse() {
    selectedDoNotShowRedirectionModal_Checkbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <s.ModalWrapper>
        {!isMobile() ? (
          <RedirectionNotificationForDesktop
            toggleRedirectionCheckboxSelection={
              toggleRedirectionCheckboxSelection
            }
            selectedDoNotShowRedirectionModal_Checkbox={
              selectedDoNotShowRedirectionModal_Checkbox
            }
            article={article}
            handleModalUse={handleModalUse}
            handleClose={handleClose}
          />
        ) : (
          <RedirectionNotificationForMobile
            handleClose={handleClose}
            article={article}
            api={api}
            setIsArticleSaved={setIsArticleSaved}
          />
        )}
      </s.ModalWrapper>
    </Modal>
  );
}
