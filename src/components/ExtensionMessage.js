import Modal from "@mui/material/Modal";
import * as s from "./ExtensionMessage.sc";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";

export default function ExtensionMessage({open, hasExtension, displayedExtensionPopup, setDisplayedExtensionPopup, setExtensionMessageOpen}) {
  
  function handleClose() {
    setExtensionMessageOpen(false);
    setDisplayedExtensionPopup(true);
    LocalStorage.setDisplayedExtensionPopup(true);
  }

  if (!hasExtension && Feature.extension_experiment1() && !displayedExtensionPopup) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <s.MyBox>
          <s.StyledCloseButton role="button" onClick={handleClose}>
            X
          </s.StyledCloseButton>
          <h1>{strings.extensionHeadline}</h1>
          <p>
            {strings.extensionAllow}
            <br /> <br />
            {strings.extensionToRead} <br /> <br />
            {strings.extensionReadability} <br /> <br />
            <a
              href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
              rel="noopener noreferrer"
            >
              {strings.extensionInstall}
            </a>
          </p>
        </s.MyBox>
      </Modal>
    );
  } else return null;
}
