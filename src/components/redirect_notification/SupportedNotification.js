import * as s from "./RedirectionNotificationModal.sc";
import { useState } from "react";
import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Body from "./modal_shared/Body";
import Footer from "./modal_shared/Footer";
import Checkbox from "./modal_shared/Checkbox";
import Icon from "./modal_shared/Icon";

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

  //runs when user enters article
  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state
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
            click
            <Icon size={"small"} src={"../static/images/zeeguuLogo.svg"} />
            The Zeeguu Reader icon
          </s.Strong>{" "}
          in the top right corner of&nbsp;your browser's toolbar
          or&nbsp;on&nbsp;the&nbsp;list of your installed
          <Icon size={"small"} src={"../static/images/puzzle.svg"} />
          extensions.
          <s.Strong> Then&nbsp;wait for the reader to open</s.Strong>.
        </p>
        <img
          className="full-width-img"
          src={"../static/images/find-extension.png"}
          alt="Zeeguu browser extension"
        />
      </Body>
      <Footer>
        <Checkbox
          label={"Don't show this message"}
          checked={redirectCheckbox}
          onChange={toggleRedirectCheckbox}
        />
        <s.ButtonsContainer oneButton>
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
