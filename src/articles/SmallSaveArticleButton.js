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
            color: '#9c7130',
            textDecoration: 'none',
            fontWeight: 400,
            backgroundColor: '#fef9f0',
            padding: '2px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: 'inherit',
            margin: 0,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { 
            e.target.style.backgroundColor = '#f0e6cc'; 
            e.target.style.color = '#8b5f28'; 
          }}
          onMouseLeave={(e) => { 
            e.target.style.backgroundColor = '#fff5e6'; 
            e.target.style.color = '#8b5f28'; 
          }}
        >
          Unsave
        </button>
      ) : (
        <button
          onClick={saveArticle}
          style={{
            background: 'none',
            border: 'none',
            color: '#9c7130',
            textDecoration: 'none',
            fontWeight: 400,
            backgroundColor: '#fef9f0',
            padding: '2px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: 'inherit',
            margin: 0,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { 
            e.target.style.backgroundColor = '#f0e6cc'; 
            e.target.style.color = '#8b5f28'; 
          }}
          onMouseLeave={(e) => { 
            e.target.style.backgroundColor = '#fff5e6'; 
            e.target.style.color = '#8b5f28'; 
          }}
        >
          Save
        </button>
      )}
    </>
  );
}
