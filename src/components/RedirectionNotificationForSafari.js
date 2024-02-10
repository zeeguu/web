import * as s from "./RedirectionNotificationModal.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export default function RedirectionNotificationForSafari({
  api,
  article,
  setIsArticleSaved,
  toggleRedirectionCheckboxSelection,
  selectedDoNotShowRedirectionModal_Checkbox,
  handleCloseAndSaveVisibilityPreferences,
  handleCloseWithoutSavingVisibilityPreferences,
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

  return (
    <>
      <s.Header>
        <h1>Your browser doesn't support the Zeeguu Reader extension.</h1>
      </s.Header>
      <s.Body>
        <p>
          To read articles with our extension, we recommend installing
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.google.com/chrome/?brand=WHAR&gad_source=1&gclid=EAIaIQobChMI3Z3blfOghAMVD6doCR33SgG1EAAYASAAEgJ6TvD_BwE&gclsrc=aw.ds"
          >
            <s.ModalStrongTextWrapper> Google Chrome </s.ModalStrongTextWrapper>
          </a>
          ,
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.mozilla.org/en-US/firefox/new/"
          >
            <s.ModalStrongTextWrapper>
              {" "}
              Mozilla Firefox
            </s.ModalStrongTextWrapper>
          </a>
          , or{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.microsoft.com/en-us/edge/download?form=MA13FJ"
          >
            <s.ModalStrongTextWrapper>Microsoft Edge</s.ModalStrongTextWrapper>
          </a>
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
        </p>
      </s.Body>
      <s.CloseButton
        role="button"
        onClick={handleCloseWithoutSavingVisibilityPreferences}
      >
        <CloseRoundedIcon fontSize="medium" />
      </s.CloseButton>
      <s.Footer>
        <s.CheckboxWrapper>
          <input
            onChange={toggleRedirectionCheckboxSelection}
            checked={selectedDoNotShowRedirectionModal_Checkbox}
            type="checkbox"
            id="checkbox"
            name=""
            value=""
          ></input>{" "}
          <label htmlFor="checkbox">Don't show this message</label>
        </s.CheckboxWrapper>
        <s.ButtonContainer>
          <a target="_self" rel="noreferrer" href={article.url}>
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
