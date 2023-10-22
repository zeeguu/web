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
          If you want to read article recommendations on your mobile device
          using Zeeguu, you need to save them by clicking the&nbsp;
          <s.ModalStrongTextWrapper>
            Add&nbsp;to&nbsp;Saves
          </s.ModalStrongTextWrapper>{" "}
          button.
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
