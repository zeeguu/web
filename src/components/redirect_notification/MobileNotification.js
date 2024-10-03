import * as s from "../modal_shared/Modal.sc";
import { useState } from "react";
import Modal from "../modal_shared/Modal";
import Header from "../modal_shared/Header.sc";
import Heading from "../modal_shared/Heading.sc";
import Main from "../modal_shared/Main.sc";
import Footer from "../modal_shared/Footer.sc";
import ButtonContainer from "../modal_shared/ButtonContainer.sc";
import Checkbox from "../modal_shared/Checkbox";
import { Button } from "../../pages/_pages_shared/Button.sc";
import AddToSavesButton from "../modal_shared/AddToSavesButton.sc";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import redirect from "../../utils/routing/routing";

export default function MobileNotification({
  article,
  api,
  setIsArticleSaved,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  open,
}) {
  const [redirectCheckbox, setRedirectCheckbox] = useState(false);

  function toggleRedirectCheckbox() {
    setRedirectCheckbox(!redirectCheckbox);
  }

  function saveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
      }
    });
  }

  //this state is saved to local storage
  function handleModalVisibilityPreferences() {
    redirectCheckbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  //runs when user enters article or saves it
  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  function handleOpenArticle(article) {
    handleSaveVisibilityPreferences(); //if user checked "Don't show this message again" or not
    redirect(article.url);
  }

  // function below saves article, visibility preferences of the modal and closes it
  function handleSaveArticleFromTheModal() {
    saveArticle();
    handleSaveVisibilityPreferences();
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>
        <Heading>It looks like you are using&nbsp;a&nbsp;mobile device</Heading>
      </Header>
      <Main>
        <p>
          If you want to read articles with the help of Zeeguu on your mobile
          device, you need to save them first by clicking the
          <s.Strong> Add&nbsp;to&nbsp;Saves</s.Strong> button.
        </p>
      </Main>
      <Footer>
        <Checkbox
          label={"Don't show this message again"}
          checked={redirectCheckbox}
          onChange={toggleRedirectCheckbox}
        />
        <ButtonContainer buttonCountNum={2}>
          <Button className="small" onClick={() => handleOpenArticle(article)}>
            Enter the article's website
          </Button>
          <AddToSavesButton onClick={handleSaveArticleFromTheModal}>
            <BookmarkBorderIcon fontSize="small" />
            Add to Saves
          </AddToSavesButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
