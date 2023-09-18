import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom/cjs/react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
  function handleModalUse() {
    selectedDoNotShowRedirectionModal === true
      ? setOpenedExternallyWithoutModal(true)
      : setOpenedExternallyWithoutModal(false);
  }

  function handleCloseAndSavePreferences() {
    handleModalUse();
    handleClose();
  }

  function handleSaveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
      }
    });
  }

  function handleSaveAndOpenArticle() {
    handleSaveArticle();
    // handleModalUse(); //Temporarily disabled for this function on mobile as it worked only when <Link> had its target set to _blank
    handleClose();
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
            handleCloseAndSavePreferences={handleCloseAndSavePreferences}
            handleClose={handleClose}
          />
        ) : (
          <RedirectionNotificationForMobile
            handleClose={handleClose}
            article={article}
            handleSaveAndOpenArticle={handleSaveAndOpenArticle}
          />
        )}
      </s.ModalWrapper>
    </Modal>
  );
}
