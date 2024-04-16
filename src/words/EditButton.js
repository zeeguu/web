import * as s from "./WordEdit.sc";
import * as sc from "./Word.sc";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import WordEditForm from "./WordEditForm";
import { APP_DOMAIN } from "../i18n/appConstants.js";

export default function EditButton({
  bookmark,
  api,
  styling,
  reload,
  setReload,
}) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function updateBookmark(bookmark, newWord, newTranslation, newContext) {
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
    api.updateBookmark(bookmark.id, newWord, newTranslation, newContext);
    bookmark.from = newWord;
    bookmark.to = newTranslation;
    bookmark.context = newContext;
    if (setReload) setReload(!reload);
  }

  return (
    <div>
      {styling === "exercise" ? (
        <s.EditButton onClick={handleOpen}>
          <img
            src={APP_DOMAIN + "/static/images/file_rename_orange_36dp.svg"}
            alt="edit"
          />
        </s.EditButton>
      ) : styling === "match" ? (
        <sc.EditIconNoPadding onClick={handleOpen}>
          <img
            src={APP_DOMAIN + "/static/images/file_rename_orange_36dp.svg"}
            alt="edit"
          />
        </sc.EditIconNoPadding>
      ) : (
        <sc.EditIcon onClick={handleOpen}>
          <img
            src={APP_DOMAIN + "/static/images/file_rename_orange_36dp.svg"}
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
        <Box sx={s.style}>
          <WordEditForm
            bookmark={bookmark}
            handleClose={handleClose}
            updateBookmark={updateBookmark}
          />
        </Box>
      </Modal>
    </div>
  );
}
