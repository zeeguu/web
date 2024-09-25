import * as s from "../modal_shared/Modal.sc";
import { useState } from "react";
import Modal from "../modal_shared/Modal";
import Header from "../modal_shared/Header";
import Heading from "../modal_shared/Heading";
import Main from "../modal_shared/Main";
import FullWidthImage from "../FullWidthImage";
import { Footer } from "../modal_shared/Footer.sc";
import ButtonContainer from "../modal_shared/ButtonContainer";
import Checkbox from "../modal_shared/Checkbox";
import { GoToButton } from "../modal_shared/GoToButton.sc";
import redirect from "../../utils/routing/routing";

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

  function handleOpenArticle(article) {
    handleModalVisibilityPreferences(); //if user checked "Don't show this message again" or not
    handleCloseRedirectionModal();
    redirect(article.url, true);
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>
        <Heading>
          You are ready to&nbsp;continue<br></br>to the original article's
          website
        </Heading>
      </Header>
      <Main>
        <p>
          Once there, <s.Strong>right-click</s.Strong> anywhere on the page and
          select the "Read with Zeeguu" option.
        </p>
        <FullWidthImage
          src={"use-extension.png"}
          alt={"Zeeguu browser extension"}
        />
      </Main>
      <Footer>
        <Checkbox
          label={"Don't show this message again"}
          checked={redirectCheckbox}
          onChange={toggleRedirectCheckbox}
        />
        <ButtonContainer buttonCountNum={1}>
          <GoToButton onClick={() => handleOpenArticle(article)}>
            Enter the article's website
          </GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
