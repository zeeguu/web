import * as s from "./RedirectionNotificationModal.sc";
import { useState } from "react";
import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Body from "./modal_shared/Body";
import Footer from "./modal_shared/Footer";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

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

  function handleSaveArticle() {
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

  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  function handleSaveArticleFromTheModal() {
    handleSaveArticle();
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>It looks like you are using&nbsp;a&nbsp;mobile device</Header>
      <Body>
        <p>
          If you want to read articles with the help of Zeeguu on your mobile
          device, you need to save them first by clicking the
          <s.Strong> Add&nbsp;to&nbsp;Saves</s.Strong> button.
        </p>
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
        <s.ButtonsContainer MORE_BUTTONS>
          <a
            target={"_self"}
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
          <s.SaveArticleButton
            role="button"
            onClick={handleSaveArticleFromTheModal}
          >
            <BookmarkBorderIcon fontSize="small" />
            Add to Saves
          </s.SaveArticleButton>
        </s.ButtonsContainer>
      </Footer>
    </Modal>
  );
}
