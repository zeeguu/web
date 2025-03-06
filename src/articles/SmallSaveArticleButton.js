import * as s from "./SmallSaveArticleButton.sc.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import { useContext, useState } from "react";
import { APIContext } from "../contexts/APIContext.js";

export default function SmallSaveArticleButton({
  article,
  isArticleSaved,
  setIsArticleSaved,
}) {
  const api = useContext(APIContext);
  const [isHoveringSave, setIsHoveringSave] = useState(false);

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

  return (
    <>
      {isArticleSaved ? (
        <s.SavedButton
          onClick={removeArticle}
          onMouseEnter={() => setIsHoveringSave(true)}
          onMouseLeave={() => setIsHoveringSave(false)}
        >
          {isHoveringSave ? (
            <BookmarkAddOutlinedIcon fontSize="small" />
          ) : (
            <BookmarkAddIcon fontSize="small" />
          )}
          Remove
        </s.SavedButton>
      ) : (
        <div>
          <s.SaveButton
            onClick={saveArticle}
            onMouseEnter={() => setIsHoveringSave(true)}
            onMouseLeave={() => setIsHoveringSave(false)}
          >
            {isHoveringSave ? (
              <BookmarkAddIcon fontSize="small" />
            ) : (
              <BookmarkAddOutlinedIcon fontSize="small" />
            )}
            Add to Saves
          </s.SaveButton>
        </div>
      )}
    </>
  );
}
