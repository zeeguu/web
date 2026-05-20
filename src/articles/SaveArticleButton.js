import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext.js";
import ActionButton from "../components/ActionButton.js";

export default function SaveArticleButton({
  article,
  isArticleSaved,
  setIsArticleSaved,
  variant,
}) {
  const api = useContext(APIContext);

  function saveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
        toast("Article added to your Saves!");
      }
    });
  }
  function removeArticle() {
    api.removePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(false);
        toast("Article removed from your Saves!");
      }
    });
  }

  // Once the article is saved, "Remove" is a rare destructive action — render
  // as a plain link so it doesn't compete with the primary Open CTA. The
  // affirmative "Save" keeps the muted-button affordance since it's the
  // call to action on Discover.
  return (
    <>
      {isArticleSaved ? (
        <ActionButton onClick={removeArticle} variant="link">
          Remove
        </ActionButton>
      ) : (
        <ActionButton onClick={saveArticle} variant={variant}>
          Save
        </ActionButton>
      )}
    </>
  );
}
