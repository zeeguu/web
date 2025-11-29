import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext.js";
import ActionButton from "../components/ActionButton.js";
import strings from "../i18n/definitions.js";

export default function SaveArticleButton({ article, isArticleSaved, setIsArticleSaved }) {
  const api = useContext(APIContext);

  function saveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
        // toast("Article added to your Saves!");
        const t = toast(
          <span>
            {strings.saveArticleAddedToast}{" "}
            <u
              onClick={() => {
                toast.dismiss(t);
                removeArticle();
              }}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                marginLeft: "6px",
                fontStyle: "italic",
              }}
            >
              {strings.saveArticleUndo}
            </u>
          </span>,
        );
      }
    });
  }

  function removeArticle() {
    api.removePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(false);
        toast(strings.saveArticleRemovedToast);
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

