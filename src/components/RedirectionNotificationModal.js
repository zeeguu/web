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
  selectedDoNotShowRedirectionModal, //related to the "Do not show" checkbox selection
  setSelectedDoNotShowRedirectionModal, //related to the "Do not show" checkbox selection
  setOpenedExternallyWithoutModal, //related to the modal use based on the "Do not show" selection
  setIsArticleSaved, // related to the article's state
}) {
  function handleVisibilityCheckboxSelection() {
    setSelectedDoNotShowRedirectionModal(!selectedDoNotShowRedirectionModal);
  }

  //saves modal visibility preferences to the Local Storage
  //ideally shared by mobile and desktop variant
  //temporarily not working for mobile
  function handleModalUse() {
    selectedDoNotShowRedirectionModal === true
      ? setOpenedExternallyWithoutModal(true)
      : setOpenedExternallyWithoutModal(false);
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <s.ModalWrapper>
        {!isMobile() ? (
          <RedirectionNotificationForDesktop
            handleVisibilityCheckboxSelection={
              handleVisibilityCheckboxSelection
            }
            selectedDoNotShowRedirectionModal={
              selectedDoNotShowRedirectionModal
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
