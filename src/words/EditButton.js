import * as s from "./WordEdit.sc";
import * as sc from "./Word.sc";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import WordEditForm from "./WordEditForm";
import { APP_DOMAIN } from "../appConstants.js";

export default function EditButton({
  bookmark,
  api,
  styling,
  reload,
  setReload,
  deleteAction,
  notifyWordChange,
}) {
  const [open, setOpen] = useState(false);
  const SOURCE_FOR_API_STAR_ACTION = "WORD_EDIT_FORM";

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
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
    api.updateBookmark(bookmark.id, newWord, newTranslation, newContext);
    if (newFitForStudy) {
      api.setIsFitForStudy(bookmark.id);
      api.starBookmark(bookmark.id);
      bookmark.starred = true;
      api.logReaderActivity(
        api.STAR_WORD,
        bookmark.article_id,
        bookmark.from,
        SOURCE_FOR_API_STAR_ACTION,
      );
    } else {
      api.setNotFitForStudy(bookmark.id);
      api.unstarBookmark(bookmark.id);
      bookmark.starred = false;
      api.logReaderActivity(
        api.UNSTAR_WORD,
        bookmark.article_id,
        bookmark.from,
        SOURCE_FOR_API_STAR_ACTION,
      );
    }
    bookmark.from = newWord;
    bookmark.to = newTranslation;
    bookmark.context = newContext;
    bookmark.fit_for_study = newFitForStudy;
    if (setReload) setReload(!reload);
    if (notifyWordChange) notifyWordChange(bookmark.id);
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
            deleteAction={deleteAction}
          />
        </Box>
      </Modal>
    </div>
  );
}
