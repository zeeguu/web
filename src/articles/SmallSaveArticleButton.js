import * as s from "./SmallSaveArticleButton.sc.js";
import { toast, ToastContainer } from "react-toastify";
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
    /*
    api.removePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(false);
        //toast("Article removed from your Saves!");
      }
    });*/
    console.log("Clicked to remove!");
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
