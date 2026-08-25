import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as s from "./WordEdit.sc";
import WordEditForm from "./WordEditForm";

// The Modal + Box shell around WordEditForm, shared by every place that lets
// the user edit a word/translation pair: the words list (EditBookmarkButton),
// the session history, and the reader's alter menu. Callers own the save
// logic and hand it in as `updateBookmark`; this component only owns the
// presentation, so the three call sites can't drift apart on modal styling.
//
// Everything beyond open/onClose/bookmark is forwarded to WordEditForm — see
// its signature for the fields that can be trimmed per call site.
export default function EditBookmarkModal({ open, onClose, bookmark, ...wordEditFormProps }) {
  const isPhoneScreen = window.innerWidth < 800;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-word-modal" aria-describedby="edit-word-form">
      <Box sx={isPhoneScreen ? s.stylePhone : s.style}>
        {bookmark && bookmark.from && (
          <WordEditForm bookmark={bookmark} handleClose={onClose} {...wordEditFormProps} />
        )}
      </Box>
    </Modal>
  );
}
