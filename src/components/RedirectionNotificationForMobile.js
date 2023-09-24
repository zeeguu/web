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
        <Link to={`/read/article?id=${article.id}`}>
          <s.GoToArticleButton role="button" onClick={handleSaveAndOpenArticle}>
            Save and view the article
          </s.GoToArticleButton>
        </Link>
      </s.Footer>
    </>
  );
}
