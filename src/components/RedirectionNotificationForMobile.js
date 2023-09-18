import * as s from "./RedirectionNotificationModal.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link } from "react-router-dom/cjs/react-router-dom";

export default function RedirectionNotificationForMobile({
  api,
  article,
  handleCloseRedirectionModal,
  setIsArticleSaved,
}) {
  function handleSaveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
      }
    });
  }

  function handleSaveAndOpenArticle() {
    handleSaveArticle();
    // handleModalVisibilityPreferences(); //Temporarily disabled for this function on mobile as it worked only when <Link> had its target set to _blank
    handleCloseRedirectionModal();
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
          <strong> Save </strong> button below the article's title or click
          <strong> Save and view the article</strong> to add it to your Saves.
        </p>
      </s.Body>
      <s.CloseButton role="button" onClick={handleCloseRedirectionModal}>
        <CloseRoundedIcon fontSize="medium" />
      </s.CloseButton>
      <s.Footer>
        {/* "Do not show this message" option temporarily not
              implemented here as the function handleModalUse() within
              handleSaveAndOpenArticle() seems to fully work with React Link
              on mobile only when target="_blank". This issue didn't occur
              on the desktop and for regular <a> links. Needs further investigation
              if we want this functionality here  */}
        <Link to={`/read/article?id=${article.id}`}>
          <s.GoToArticleButton role="button" onClick={handleSaveAndOpenArticle}>
            Save and view the article
          </s.GoToArticleButton>
        </Link>
      </s.Footer>
    </>
  );
}
