import * as sc from "./Word.sc";
import { useState } from "react";
import * as s from "./WordEdit.sc";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import WordEditAccordions from "./WordEditAccordions";
import strings from "../i18n/definitions";

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
    if (setReload) setReload(!reload);
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
      bookmark.context
    );
    api.updateBookmark(bookmark.id, newWord, newTranslation, newContext);
    bookmark.from = newWord;
    bookmark.to = newTranslation;
    bookmark.context = newContext;
  }

  return (
    <div>
      {styling === "exercise" ? (
        <s.EditButton onClick={handleOpen}>
          <img src="/static/images/file_rename_white_36dp.svg" alt="edit" />
        </s.EditButton>
      ) : styling === "match" ? (
        <sc.EditIconNoPadding onClick={handleOpen}>
          <img src="/static/images/file_rename_orange_36dp.svg" alt="edit" />
        </sc.EditIconNoPadding>
      ) : (
        <sc.EditIcon onClick={handleOpen}>
          <img src="/static/images/file_rename_orange_36dp.svg" alt="edit" />
        </sc.EditIcon>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={s.style}>
          <WordEditAccordions
            bookmark={bookmark}
            updateBookmark={updateBookmark}
          />
          <s.Small>{strings.rememberToSubmit}</s.Small>
          <s.DoneButtonHolder>
            <s.DoneButton onClick={handleClose}>{strings.done}</s.DoneButton>
          </s.DoneButtonHolder>
        </Box>
      </Modal>
    </div>
  );
}
