import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext.js";
import ActionButton from "../components/ActionButton.js";
import strings from "../i18n/definitions.js";
import {showSingleActionToast} from "./utils/showActionToast";

export default function SaveArticleButton({ article, isArticleSaved, setIsArticleSaved }) {
  const api = useContext(APIContext);

  function saveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
          showSingleActionToast(strings.saveArticleAddedToast,() => removeArticle(),3000);
          setIsArticleSaved(true);
      }
    });
  }

  function removeArticle() {
    api.removePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(false);
        showSingleActionToast(strings.saveArticleRemovedToast);
      }
    });
  }

  return (
    <>
      {isArticleSaved ? (
        <ActionButton onClick={removeArticle}>{strings.saveArticleButtonUnsave}</ActionButton>
      ) : (
        <ActionButton onClick={saveArticle}>{strings.saveArticleButtonSave}</ActionButton>
      )}
    </>
  );
}

