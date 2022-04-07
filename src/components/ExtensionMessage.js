import Modal from "@mui/material/Modal";
import * as s from "./ExtensionMessage.sc";

export default function ExtensionMessage({ handleClose, open }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <s.MyBox>
        <h1>Install the Zeeguu Chrome Extension to read articles</h1>
        <p>
          The extension allows you to enrich your vocabulary in a foreign
          language while browsing the web and reading articles that are
          interesting to you. These could be articles on news sites, blogs, or
          encyclopedias like Wikipedia.
          <br /> <br />
          To read articles with the help of Zeeguu you need to read them from
          the Chrome Extension or by adding the texts to "Own Texts" through the
          "Save article to Zeeguu.org" button from within the extension.
          <br /> <br />
          For better readability, the extension removes all excess clutter, like
          adverts, buttons, and videos.
          <br /> <br />
          <a
            href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
            target="_blank"
            rel="noopener noreferrer"
          >
            Install it in the Chrome Web Store
          </a>
        </p>
      </s.MyBox>
    </Modal>
  );
}
