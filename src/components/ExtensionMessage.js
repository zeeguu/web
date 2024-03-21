import Modal from "@mui/material/Modal";
import { getExtensionInstallationLinks } from "../utils/misc/extensionCommunication";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import * as s from "./ExtensionMessage.sc";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";

export default function ExtensionMessage({
  open,
  hasExtension,
  displayedExtensionPopup,
  setDisplayedExtensionPopup,
  setExtensionMessageOpen,
}) {
  function handleClose() {
    setExtensionMessageOpen(false);
    setDisplayedExtensionPopup(true);
    LocalStorage.setDisplayedExtensionPopup(true);
  }

  if (
    !hasExtension &&
    Feature.extension_experiment1() &&
    !displayedExtensionPopup
  ) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <s.ModalWrapper>
          <s.CloseButton role="button" onClick={handleClose}>
            <CloseRoundedIcon fontSize="medium" />
          </s.CloseButton>
          <s.Header className="modalHeader">
            <h1>
              <span className="annotation">New!</span>&nbsp;
              {strings.extensionHeadline}
            </h1>
          </s.Header>
          <s.Body className="modalBody">
            <p>
              {/* Proposal for a shortened and updated paragraph, temporarily hardcoded */}
              To read articles recommended by Zeeguu that are not saved or to
              read external articles, you need to install The Zeeguu Reader
              browser extension.
            </p>
            <img
              className="full-width-img"
              src={"../static/images/find-extension.png"}
              //TODO: Add new alt description
              alt="Zeeguu browser extension"
            />
          </s.Body>
          <s.Footer>
            <a
              className="install-links"
              href={getExtensionInstallationLinks()}
              rel="noopener noreferrer"
            >
              <s.InstallLink>
                <FileDownloadOutlinedIcon fontSize="small" />
                Install the Extension
              </s.InstallLink>
            </a>
          </s.Footer>
        </s.ModalWrapper>
      </Modal>
    );
  } else return null;
}
