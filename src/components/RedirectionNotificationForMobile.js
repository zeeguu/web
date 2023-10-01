import * as s from "./RedirectionNotificationModal.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export default function RedirectionNotificationForMobile({
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
        <h1>It looks like you are using&nbsp;a&nbsp;mobile device</h1>
      </s.Header>
      <s.Body>
        <p>
          If you want to read articles on your mobile device using Zeeguu, just
          tap on the
          <s.ModalStrongTextWrapper> Save </s.ModalStrongTextWrapper> button
          below the article's title or click
          <s.ModalStrongTextWrapper>
            {" "}
            Save to Zeeguu
          </s.ModalStrongTextWrapper>{" "}
          to add it to your Saves.
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
          Save to Zeeguu
        </s.SaveArticleButton>
      </s.Footer>
    </>
  );
}
