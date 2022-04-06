import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import * as s from "../words/WordEdit.sc"


export default function ExtensionMessage({handleClose, open}) {

  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={s.style}>
      <p>Zeeguu has launched a Chrome Extension, which you will need to use, when reading articles</p>
      <p>The extension allows you to enrich your vocabulary in a foreign language while browsing the web and reading articles that are interesting to you.
          These could be articles on news sites, blogs, or encyclopedias like Wikipedia.
          For better readability, all excess clutter, like adverts, buttons, and videos are removed, leaving the article looking more like a page in a book.
          <br/> <br/>
      <a href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd" target="_blank" rel="noopener noreferrer"> Install it in the Chrome Web Store</a>
      </p>
    </Box>
  </Modal>

  );
}
