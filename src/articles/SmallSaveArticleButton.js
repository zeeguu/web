import * as s from "./SmallSaveArticleButton.sc.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  return (
    <>
      {isArticleSaved ? (
        <s.SavedLabel>
          {" "}
          Saved <img
            src="/static/images/zeeguuLogo.svg"
            width="11"
            alt={""}
          />{" "}
        </s.SavedLabel>
      ) : (
        <div>
          <s.SaveButton onClick={saveArticle}>Save</s.SaveButton>
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
