import * as s from "./RedirectionNotificationModal.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function RedirectionNotificationForSupportedBrowsers({
  article,
  toggleRedirectCheckbox,
  redirectCheckbox,
  handleCloseAndSaveVisibilityPreferences,
  handleClose,
}) {
  return (
    <>
      <s.Header>
        <h1>
          You are ready to&nbsp;continue<br></br>
          to the original article's website
        </h1>
      </s.Header>
      <s.Body>
        <p>
          <s.ModalStrongTextWrapper>Once there</s.ModalStrongTextWrapper>, find
          and{" "}
          <s.ModalStrongTextWrapper>
            click The Zeeguu Reader{" "}
            <s.Icon>
              <img
                className="fullDivWidthImage"
                alt=""
                src="../static/images/zeeguuLogo.svg"
              ></img>
            </s.Icon>{" "}
            icon
          </s.ModalStrongTextWrapper>{" "}
          in the top right corner of&nbsp;your browser's toolbar
          or&nbsp;on&nbsp;the&nbsp;list of your installed extensions{" "}
          <s.Icon>
            <img
              className="fullDivWidthImage"
              alt=""
              src="../static/images/puzzle.svg"
            ></img>
          </s.Icon>
          .{" "}
          <s.ModalStrongTextWrapper>
            Then&nbsp;wait for the reader to open
          </s.ModalStrongTextWrapper>
          .
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
            onChange={toggleRedirectCheckbox}
            checked={redirectCheckbox}
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
            onClick={handleCloseAndSaveVisibilityPreferences}
          >
            Enter the article's website
          </s.GoToArticleButton>
        </a>
      </s.Footer>
      <s.CloseButton role="button" onClick={handleClose}>
        <CloseRoundedIcon fontSize="medium" />
      </s.CloseButton>
    </>
  );
}
