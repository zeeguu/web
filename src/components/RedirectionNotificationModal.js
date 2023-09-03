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
  setIsSaved, // related to the article's state
}) {
  function handleVisibilityCheckboxSelection() {
    setSelectedDoNotShowRedirectionModal(!selectedDoNotShowRedirectionModal);
  }

  function handleModalUse() {
    selectedDoNotShowRedirectionModal === true
      ? setOpenedExternallyWithoutModal(true)
      : setOpenedExternallyWithoutModal(false);
  }

  function handleCloseAndSavePreferences() {
    handleModalUse();
    handleClose();
  }

  async function handleSaveArticle() {
    await api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsSaved(true);
      }
    });
  }

  function handleCloseMobile() {
    handleSaveArticle();
    handleClose();
  }
  return (
    <Modal open={open} onClose={handleClose}>
      <s.ModalWrapper>
        {isMobile() === false ? (
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
                to the article and closes the modal so that when the user
                returns to the Zeeguu app home page, they can see the recommendation
                list instead of the modal still being open */}
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
              {/* Saves the article and opens internally */}
              <Link to={`/read/article?id=${article.id}`}>
                <s.GoToArticleButton role="button" onClick={handleCloseMobile}>
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
