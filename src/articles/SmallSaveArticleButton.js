import * as s from "./SmallSaveArticleButton.sc.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useState } from "react";

export default function SmallSaveArticleButton({
  article,
  api,
  isArticleSaved,
  setIsArticleSaved,
}) {
  const [savedText, setSavedText] = useState("Saved");

  function saveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
        toast("Article added to your Saves!");
      }
    });
  }

  function onMouseOverSaved(e) {
    setSavedText("Remove?");
  }
  function onMouseLeave(e) {
    setSavedText("Saved");
  }

  return (
    <>
      {isArticleSaved ? (
        <s.SavedArticleDiv>
          <s.SavedLabel
            onMouseEnter={(e) => onMouseOverSaved(e)}
            onMouseLeave={(e) => onMouseLeave(e)}
          >
            {" "}
            {savedText === "Saved" ? (
              <BookmarkIcon fontSize="small" />
            ) : (
              <BookmarkBorderIcon fontSize="small" />
            )}
            {savedText}
          </s.SavedLabel>
          <s.SavedLabel onClick={saveArticle}>
            <BookmarkBorderIcon fontSize="small" />
            Remove
          </s.SavedLabel>
        </s.SavedArticleDiv>
      ) : (
        <div>
          <s.SaveButton onClick={saveArticle}>
            <BookmarkBorderIcon fontSize="small" />
            Add to Saves
          </s.SaveButton>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
