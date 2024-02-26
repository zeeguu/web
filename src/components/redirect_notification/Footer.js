import * as s from "./RedirectionNotificationModal.sc";
import { useState } from "react";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
  isMobile,
  isSupportedBrowser,
} from "../../utils/misc/browserDetection";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export default function Footer({
  notificationType,
  api,
  article,
  setIsArticleSaved,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
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

  function handleSaveArticleFromTheModal() {
    handleSaveArticle();
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  //this state is saved to local storage
  function handleModalVisibilityPreferences() {
    redirectCheckbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  //when user enters article or saves it
  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  //when user exits modal by clicking "X"
  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state to avoid it being prechecked when the user re-enters the modal
  }

  function renderExtensionLinks() {
    if (runningInChromeDesktop()) {
      return "https://chrome.google.com/webstore/detail/the-zeeguu-reader/ckncjmaednfephhbpeookmknhmjjodcd";
    }
    if (runningInFirefoxDesktop()) {
      return "https://addons.mozilla.org/en-US/firefox/addon/the-zeeguu-reader/";
    }
  }

  function adaptGoToButton() {
    if (notificationType === "supportedNotInstalled") {
      return {
        href: renderExtensionLinks(),
        text: "Install the Extension",
      };
    } else
      return {
        href: article.url,
        text: "Enter the article's website",
      };
  }

  function adaptButtonContainer() {
    return isSupportedBrowser() ? "oneButton" : "twoButtons";
  }

  let primaryButton = adaptGoToButton();

  return (
    <>
      <s.Footer>
        {notificationType !== "supportedNotInstalled" && (
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
        )}

        <s.ButtonsContainer adaptButtonContainer={adaptButtonContainer}>
          <a
            target={isMobile() ? "_self" : "_blank"}
            rel="noreferrer"
            href={primaryButton.href}
            className="link"
          >
            <s.GoToArticleButton
              role="button"
              // function below saves visibility preferences of the modal and closes it
              onClick={handleSaveVisibilityPreferences}
            >
              {primaryButton.text}
            </s.GoToArticleButton>
          </a>

          {!isSupportedBrowser() && (
            <s.SaveArticleButton
              role="button"
              onClick={handleSaveArticleFromTheModal}
            >
              <BookmarkBorderIcon fontSize="small" />
              Add to Saves
            </s.SaveArticleButton>
          )}
        </s.ButtonsContainer>
      </s.Footer>
      <s.CloseButton role="button" onClick={handleCancel}>
        <CloseRoundedIcon fontSize="medium" />
      </s.CloseButton>
    </>
  );
}
