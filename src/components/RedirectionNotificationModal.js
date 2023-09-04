import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom/cjs/react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as s from "../components/RedirectionNotificationModal.sc";
import { isMobile } from "../utils/misc/browserDetection";

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
          // Displayed to the users who access Zeeguu from desktop browsers
          <>
            <s.Header>
              <h1>
                You are ready to&nbsp;continue<br></br>
                to the original article's website
              </h1>
            </s.Header>
            <s.Body>
              <p>
                <strong>Once there</strong>, find and{" "}
                <strong>
                  click The Zeeguu Reader{" "}
                  <s.Icon>
                    <img
                      className="fullDivWidthImage"
                      alt=""
                      src="../static/images/zeeguuLogo.svg"
                    ></img>
                  </s.Icon>{" "}
                  icon
                </strong>{" "}
                in the top right corner of&nbsp;your browser's toolbar
                or&nbsp;on&nbsp;the&nbsp;list of your installed extensions{" "}
                <s.Icon>
                  <img
                    className="fullDivWidthImage"
                    alt=""
                    src="../static/images/puzzle.svg"
                  ></img>
                </s.Icon>
                . <strong>Then&nbsp;select Read Article</strong>.
              </p>
              <img
                className="fullDivWidthImage"
                src={"../static/images/find-extension.png"}
                alt="Zeeguu browser extension"
              />
            </s.Body>
            <s.Footer>
              <s.CheckboxWrapper>
                <input
                  onChange={handleVisibilityCheckboxSelection}
                  checked={selectedDoNotShowRedirectionModal}
                  type="checkbox"
                  id="checkbox"
                  name=""
                  value=""
                ></input>{" "}
                <label htmlFor="checkbox">Don't show this message</label>
              </s.CheckboxWrapper>
              <a target="_blank" rel="noreferrer" href={article.url}>
                {/* Clicking the GoToArticleButton button sends the reader
                to the article, saves visibility preferences of the modal and closes it */}
                <s.GoToArticleButton
                  role="button"
                  onClick={handleCloseAndSavePreferences}
                >
                  Enter the article's website
                </s.GoToArticleButton>
              </a>
            </s.Footer>
            <s.CloseButton role="button" onClick={handleClose}>
              <CloseRoundedIcon fontSize="medium" />
            </s.CloseButton>
          </>
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
