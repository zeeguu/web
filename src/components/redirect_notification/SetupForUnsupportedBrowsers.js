import * as s from "./RedirectionNotificationModal.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  isMobile,
  runningInFirefoxDesktop,
  runningInChromeDesktop,
} from "../../utils/misc/browserDetection";

export default function SetupForUnsupportedBrowsers({
  api,
  article,
  setIsArticleSaved,
  toggleRedirectCheckbox,
  redirectCheckbox,
  handleCloseAndSaveVisibilityPreferences,
  handleClose,
}) {
  function handleSaveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
      }
    });
  }

  function handleSaveArticleAndCloseModal() {
    handleSaveArticle();
    handleCloseAndSaveVisibilityPreferences();
  }

  function handleGoToArticleAndCloseModal() {
    handleCloseAndSaveVisibilityPreferences();
  }

  function renderHeaderForUnsupportedBrowsers() {
    let headerContentForMobile = (
      <h1>It looks like you are using&nbsp;a&nbsp;mobile device</h1>
    );

    let headerContentForUnsupportedDesktop = (
      <h1>
        Your browser doesn't support <br></br>
        <s.IconHeader
          className="fullDivWidthImage"
          alt=""
          src="../static/images/zeeguuLogo.svg"
        ></s.IconHeader>{" "}
        The Zeeguu Reader extension
      </h1>
    );

    if (isMobile()) {
      return headerContentForMobile;
    } else if (!runningInFirefoxDesktop() && !runningInChromeDesktop()) {
      return headerContentForUnsupportedDesktop;
    }
  }

  function renderBodyForUnsupportedBrowsers() {
    let bodyContentForMobile = (
      <p>
        If you want to read articles with the help of Zeeguu on your mobile
        device, you need to save them first by clicking the
        <s.ModalStrongTextWrapper>
          {" "}
          Add&nbsp;to&nbsp;Saves
        </s.ModalStrongTextWrapper>{" "}
        button.
      </p>
    );

    let bodyContentForUnsupportedDesktop = (
      <>
        {" "}
        <p>
          To read articles with our extension, we recommend installing
          <s.ExternalLink
            target="_blank"
            rel="noreferrer"
            href="https://www.google.com/chrome/?brand=WHAR&gad_source=1&gclid=EAIaIQobChMI3Z3blfOghAMVD6doCR33SgG1EAAYASAAEgJ6TvD_BwE&gclsrc=aw.ds"
          >
            <s.ModalStrongTextWrapper>
              {" "}
              Google&nbsp;Chrome
            </s.ModalStrongTextWrapper>
          </s.ExternalLink>
          ,{" "}
          <s.ExternalLink
            target="_blank"
            rel="noreferrer"
            href="https://www.mozilla.org/en-US/firefox/new/"
          >
            <s.ModalStrongTextWrapper>
              Mozilla&nbsp;Firefox
            </s.ModalStrongTextWrapper>
          </s.ExternalLink>
          , or{" "}
          <s.ExternalLink
            target="_blank"
            rel="noreferrer"
            href="https://www.microsoft.com/en-us/edge/download?form=MA13FJ"
          >
            <s.ModalStrongTextWrapper>
              Microsoft&nbsp;Edge
            </s.ModalStrongTextWrapper>
          </s.ExternalLink>
          .{" "}
        </p>
        <p>
          To read this article with the help of{" "}
          <s.ModalStrongTextWrapper>Zeeguu</s.ModalStrongTextWrapper> on your
          current browser, click
          <s.ModalStrongTextWrapper>
            {" "}
            Add&nbsp;to&nbsp;Saves
          </s.ModalStrongTextWrapper>{" "}
          to save it first.
        </p>{" "}
      </>
    );

    if (isMobile()) {
      return bodyContentForMobile;
    } else if (!runningInFirefoxDesktop() && !runningInChromeDesktop()) {
      return bodyContentForUnsupportedDesktop;
    }
  }

  return (
    <>
      <s.Header>{renderHeaderForUnsupportedBrowsers()}</s.Header>
      <s.Body>{renderBodyForUnsupportedBrowsers()}</s.Body>
      <s.CloseButton role="button" onClick={handleClose}>
        <CloseRoundedIcon fontSize="medium" />
      </s.CloseButton>
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
        <s.ButtonContainer>
          <a
            target={isMobile() ? "_self" : "_blank"}
            rel="noreferrer"
            href={article.url}
          >
            <s.GoToArticleButton
              role="button"
              onClick={handleGoToArticleAndCloseModal}
            >
              Enter the article's website
            </s.GoToArticleButton>
          </a>
          <s.SaveArticleButton
            role="button"
            onClick={handleSaveArticleAndCloseModal}
          >
            <BookmarkBorderIcon fontSize="small" />
            Add to Saves
          </s.SaveArticleButton>
        </s.ButtonContainer>
      </s.Footer>
    </>
  );
}
