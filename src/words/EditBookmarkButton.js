import * as s from "./WordEdit.sc";
import * as sc from "./Word.sc";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import WordEditForm from "./WordEditForm";
import { getStaticPath } from "../utils/misc/staticPath.js";
import { toast } from "react-toastify";

import { isTextInSentence } from "../utils/text/expressions";

export default function EditBookmarkButton({
  bookmark,
  api,
  styling,
  reload,
  setReload,
  notifyWordChange,
  notifyDelete,
}) {
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
          api.logReaderActivity(
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

    api.updateBookmark(bookmark.id, newWord, newTranslation, newContext);
    // If we want the context to update we need to have the update bookmark send the
    // context back tokenized, or have the frontend ask for a tokenized version.
    if (newFitForStudy) {
      api.userSetForExercises(bookmark.id);
      api.logReaderActivity(
        api.USER_SET_WORD_PREFERRED,
        bookmark.article_id,
        bookmark.from,
        SOURCE_FOR_API_USER_PREFERENCE,
      );
    } else {
      api.userSetNotForExercises(bookmark.id);
      api.logReaderActivity(
        api.USER_SET_NOT_WORD_PREFERED,
        bookmark.article_id,
        bookmark.from,
        SOURCE_FOR_API_USER_PREFERENCE,
      );
    }
    if (setReload) setReload(!reload);
    if (notifyWordChange) notifyWordChange(bookmark.id);
    toast.success("Thank you for the contribution!");
    handleClose();
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
