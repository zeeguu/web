import * as s from "./RedirectionNotificationModal.sc";
import { useState } from "react";
import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Body from "./modal_shared/Body";
import Footer from "./modal_shared/Footer";

export default function SupportedNotification({
  article,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  open,
}) {
  const [redirectCheckbox, setRedirectCheckbox] = useState(false);

  function toggleRedirectCheckbox() {
    setRedirectCheckbox(!redirectCheckbox);
  }

  //this state is saved to local storage
  function handleModalVisibilityPreferences() {
    redirectCheckbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state
  }

  function getSmallIcon(src) {
    return (
      <s.Icon>
        <img className="fullDivWidthImage" alt="" src={src}></img>
      </s.Icon>
    );
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>
        You are ready to&nbsp;continue<br></br>to the original article's website
      </Header>
      <Body>
        <p>
          <s.Strong>Once there</s.Strong>, find and{" "}
          <s.Strong>
            click The Zeeguu Reader{" "}
            {getSmallIcon("../static/images/zeeguuLogo.svg")}
            icon
          </s.Strong>{" "}
          in the top right corner of&nbsp;your browser's toolbar
          or&nbsp;on&nbsp;the&nbsp;list of your installed extensions{" "}
          {getSmallIcon("../static/images/puzzle.svg")}.{" "}
          <s.Strong>Then&nbsp;wait for the reader to open</s.Strong>.
        </p>
        <img
          className="fullDivWidthImage"
          src={"../static/images/find-extension.png"}
          alt="Zeeguu browser extension"
        />
      </Body>
      <Footer>
        <s.CheckboxWrapper>
          <input
            onChange={toggleRedirectCheckbox}
            checked={redirectCheckbox}
            notificationType="checkbox"
            id="checkbox"
            name=""
            value=""
            type="checkbox"
          ></input>
          <label htmlFor="checkbox">Don't show this message</label>
        </s.CheckboxWrapper>
        <s.ButtonsContainer ONE_BUTTON>
          <a
            target={"_blank"}
            rel="noreferrer"
            href={article.url}
            className="link"
          >
            <s.GoToButton
              role="button"
              onClick={handleSaveVisibilityPreferences}
            >
              Enter the article's website
            </s.GoToButton>
          </a>
        </s.ButtonsContainer>
      </Footer>
    </Modal>
  );
}
