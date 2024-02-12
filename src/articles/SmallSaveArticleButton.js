import * as s from "./SmallSaveArticleButton.sc.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

export default function SmallSaveArticleButton({
  article,
  api,
  isArticleSaved,
  setIsArticleSaved,
}) {
  
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
      console.log("Deleted!");
      console.log(data);
      if (data === "OK") {
        setIsArticleSaved(false);
        toast("Article removed from your Saves!");
      }
    });
  }

  return (
    <>
      {isArticleSaved ? (
          <s.SavedLabel onClick={removeArticle}>
            <BookmarkIcon fontSize="small" />
              Remove
          </s.SavedLabel>
      ) : (
        <div>
          <s.SaveButton onClick={saveArticle}>
            <BookmarkBorderIcon fontSize="small" />
            Add to Saves
          </s.SaveButton>
        </div>
      )}


    </>
  );
}
