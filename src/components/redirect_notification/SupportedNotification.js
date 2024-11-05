import { useState, useEffect } from "react";
import Modal from "../modal_shared/Modal";
import Header from "../modal_shared/Header.sc";
import Heading from "../modal_shared/Heading.sc";
import Main from "../modal_shared/Main.sc";
import FullWidthImage from "../FullWidthImage";
import Footer from "../modal_shared/Footer.sc";
import ButtonContainer from "../modal_shared/ButtonContainer.sc";
import Checkbox from "../modal_shared/Checkbox";
import Button from "../../pages/_pages_shared/Button.sc";
import redirect from "../../utils/routing/routing";

export default function SupportedNotification({
  article,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  open,
}) {
  const [redirectCheckbox, setRedirectCheckbox] = useState(false);
  const [gifSrc, setGifSrc] = useState("enable-zeeguu.gif");

  useEffect(() => {
    // When 'open' is true, the useEffect hook sets the GIF source to a unique URL with a timestamp query parameter.
    // This forces the browser to reload the GIF each time the modal is open,
    // preventing it from using a cached version and ensuring the GIF plays from the start.
    if (open) {
      setGifSrc(`enable-zeeguu.gif?timestamp=${new Date().getTime()}`);
    }
  }, [open]);

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
        <FullWidthImage src={gifSrc} alt={"Zeeguu browser extension"} />
      </Main>
      <Footer>
        <Checkbox
          label={"Don't show this message again"}
          checked={redirectCheckbox}
          onChange={toggleRedirectCheckbox}
        />
        <ButtonContainer buttonCountNum={1}>
          <Button className="small" onClick={() => handleOpenArticle(article)}>
            Enter the article's website
          </Button>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
