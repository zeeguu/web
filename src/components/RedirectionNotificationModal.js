import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom/cjs/react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as s from "../components/RedirectionNotificationModal.sc";
import { isMobile } from "../utils/misc/browserDetection";
import RedirectionNotificationForDesktop from "./RedirectionNotificationForDesktop";

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
          // Displayed to the users who access Zeeguu from mobile browsers
          //Todo: Create modal content components for these separate views
          <>
            <s.Header>
              <h1>It looks like you are using&nbsp;a&nbsp;mobile device</h1>
            </s.Header>
            <s.Body>
              <p>
                If you want to read articles on your mobile device using Zeeguu,
                just tap on the
                <strong> Save </strong> button below the article's title or
                click<strong> Save and view the article</strong> to add it to
                your Saves.
              </p>
            </s.Body>
            <s.CloseButton role="button" onClick={handleClose}>
              <CloseRoundedIcon fontSize="medium" />
            </s.CloseButton>
            <s.Footer>
              {/* "Do not show this message" option temporarily not
              implemented here as the function handleModalUse() within
              handleSaveAndOpenArticle() seems to fully work with React Link
              on mobile only when target="_blank". This issue didn't occur
              on the desktop and for regular <a> links. Needs further investigation
              if we want this functionality here  */}
              <Link to={`/read/article?id=${article.id}`}>
                <s.GoToArticleButton
                  role="button"
                  onClick={handleSaveAndOpenArticle}
                >
                  Save and view the article
                </s.GoToArticleButton>
              </Link>
            </s.Footer>
          </>
        )}
      </s.ModalWrapper>
    </Modal>
  );
}
