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
        <button
          onClick={removeArticle}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontSize: 'inherit'
          }}
        >
          [Unsave]
        </button>
      ) : (
        <button
          onClick={saveArticle}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontSize: 'inherit'
          }}
        >
          [Save]
        </button>
      )}
    </>
  );
}
