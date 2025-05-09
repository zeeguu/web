import * as s from "./WordEdit.sc";
import * as sc from "./Word.sc";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import WordEditForm from "./WordEditForm";
import { getStaticPath } from "../utils/misc/staticPath.js";
import { toast } from "react-toastify";

import { isTextInSentence } from "../utils/text/expressions";
import { APIContext } from "../contexts/APIContext.js";

export default function EditBookmarkButton({
  bookmark,
  styling,
  reload,
  setReload,
  notifyWordChange,
  notifyDelete,
}) {
  const api = useContext(APIContext);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const SOURCE_FOR_API_USER_PREFERENCE = "WORD_EDIT_FORM_CHECKBOX";
  const SOURCE_FOR_API_BOOKMARK_DELETE = "WORD_EDIT_DELETE_BOOKMARK";

  function handleOpen() {
    setOpen(true);
  }

  function deleteBookmark() {
    api.deleteBookmark(
      bookmark.id,
      (response) => {
        if (response === "OK") {
          // delete was successful; log and close
          if (notifyDelete) notifyDelete(bookmark);
          api.logUserActivity(
            api.DELETE_WORD,
            bookmark.article_id,
            bookmark.from,
            SOURCE_FOR_API_BOOKMARK_DELETE,
          );
          handleClose();
        }
      },
      (error) => {
        // onError
        console.log(error);
        alert(
          "something went wrong and we could not delete the bookmark; try again later.",
        );
      },
    );
  }

  function handleClose() {
    setOpen(false);
    setErrorMessage();
  }

  function updateBookmark(
    bookmark,
    newWord,
    newTranslation,
    newContext,
    newFitForStudy,
  ) {
    console.log(
      "Sending to the API. New word: ",
      newWord,
      " instead of: ",
      bookmark.from,
      "Sending to the API. New translation: ",
      newTranslation,
      " instead of: ",
      bookmark.to,
      "Sending to the API. New context: ",
      newContext,
      " instead of: ",
      bookmark.context,
    );
    if (!isTextInSentence(newWord, newContext)) {
      setErrorMessage(
        `'${newWord}' is not present in the context. Make sure the context contains the word.`,
      );
      // Uncomment to also send a toast
      // toast.error("The Word is not present in the context.");
      return;
    }

    bookmark.from = newWord;
    bookmark.to = newTranslation;
    bookmark.context = newContext;
    bookmark.fit_for_study = newFitForStudy;

    api
      .updateBookmark(
        bookmark.id,
        newWord,
        newTranslation,
        newContext,
        bookmark.context_identifier,
      )
      .then((response) => response.data)
      .then((newBookmark) => {
        console.dir(newBookmark);
        bookmark.context_tokenized = newBookmark.context_tokenized;
        bookmark.context_in_content = newBookmark.context_in_content;
        bookmark.left_ellipsis = newBookmark.left_ellipsis;
        bookmark.right_ellipsis = newBookmark.right_ellipsis;
        bookmark.id = newBookmark.id;

        if (newFitForStudy) {
          api.userSetForExercises(bookmark.id);
          api.logUserActivity(
            api.USER_SET_WORD_PREFERRED,
            newBookmark.article_id,
            newBookmark.from,
            SOURCE_FOR_API_USER_PREFERENCE,
          );
        } else {
          api.userSetNotForExercises(bookmark.id);
          api.logUserActivity(
            api.USER_SET_NOT_WORD_PREFERED,
            newBookmark.article_id,
            newBookmark.from,
            SOURCE_FOR_API_USER_PREFERENCE,
          );
        }
        if (setReload) setReload(!reload);

        if (notifyWordChange) notifyWordChange(bookmark);
        toast.success("Thank you for the contribution!");
        handleClose();
      });
  }

  const isPhoneScreen = window.innerWidth < 800;
  return (
    <div>
      {styling === "exercise" ? (
        <s.EditButton onClick={handleOpen}>
          <img
            src={getStaticPath("images", "file_rename_orange_36dp.svg")}
            alt="edit"
          />
        </s.EditButton>
      ) : styling === "match" ? (
        <sc.EditIconNoPadding onClick={handleOpen}>
          <img
            src={getStaticPath("images", "file_rename_orange_36dp.svg")}
            alt="edit"
          />
        </sc.EditIconNoPadding>
      ) : (
        <sc.EditIcon onClick={handleOpen}>
          <img
            src={getStaticPath("images", "file_rename_orange_36dp.svg")}
            alt="edit"
          />
        </sc.EditIcon>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={isPhoneScreen ? s.stylePhone : s.style}>
          <WordEditForm
            bookmark={bookmark}
            errorMessage={errorMessage}
            handleClose={handleClose}
            updateBookmark={updateBookmark}
            deleteAction={deleteBookmark}
          />
        </Box>
      </Modal>
    </div>
  );
}
