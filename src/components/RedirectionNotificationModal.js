import Modal from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as s from "../components/RedirectionNotificationModal.sc";

//This modal is used in the ArticlePreview component

//TODO: Further refactor, e.g after testing and making sure users
//understand text and wording, turn strings into variables and move to definitions.js

export default function RedirectionNotificationModal({
  article,
  open,
  handleClose, //handleClose function defined in the ArticlePreview.js, passed as a prop
}) {
  return (
    <Modal open={open} onClose={handleClose}>
      <s.ModalWrapper>
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
                  alt="The Zeeguu Reader elephant icon"
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
                alt="Browser extensions puzzle icon"
                src="../static/images/puzzle.svg"
              ></img>
            </s.Icon>
            . <strong>Then&nbsp;select Read Article</strong>.
          </p>
          <img
            className="fullDivWidthImage"
            src={"../static/images/find-extension.png"}
            //TODO: Add new alt description
            alt="Zeeguu browser extension"
          />
        </s.Body>
        <s.Footer>
          <s.Checkbox>
            <label for="checkbox"> Don't show this again</label>
            <input
              type="checkbox"
              id="checkbox"
              name="noshow"
              value="Do not show again"
            ></input>{" "}
          </s.Checkbox>
          <a target="_blank" rel="noreferrer" href={article.url}>
            {/* Clicking the GoToArticleButton button sends the reader
                to the article and closes the modal so that when the user
                returns to the Zeeguu app home page, they can see the recommendation
                list instead of the modal still being open */}
            <s.GoToArticleButton role="button" onClick={handleClose}>
              Enter the article's website
            </s.GoToArticleButton>
          </a>
        </s.Footer>
        <s.CloseButton role="button" onClick={handleClose}>
          <CloseRoundedIcon fontSize="medium" />
        </s.CloseButton>
      </s.ModalWrapper>
    </Modal>
  );
}
