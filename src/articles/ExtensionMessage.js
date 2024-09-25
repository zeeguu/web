import Modal from "../components/modal_shared/Modal";
import { Header } from "../components/modal_shared/Header.sc";
import { Heading } from "../components/modal_shared/Heading.sc";
import { Main } from "../components/modal_shared/Main.sc";
import FullWidthImage from "../components/FullWidthImage";
import Footer from "../pages/_pages_shared/Footer";
import ButtonContainer from "../components/modal_shared/ButtonContainer";
import { GoToButton } from "../components/modal_shared/GoToButton.sc";
import { getExtensionInstallationLinks } from "../utils/extension/extensionInstallationLinks";
import { isSupportedBrowser } from "../utils/misc/browserDetection";
import { isMobile } from "../utils/misc/browserDetection";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import redirect from "../utils/routing/routing";

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
    isSupportedBrowser() &&
    !hasExtension &&
    Feature.extension_experiment1() &&
    !isMobile() &&
    !displayedExtensionPopup
  ) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Header>
          <Heading>
            <span className="annotation">New!</span>&nbsp;
            {strings.extensionHeadline}
          </Heading>
        </Header>
        <Main>
          <p>
            To read articles recommended by Zeeguu that are not saved or to read
            external articles, you need to install The Zeeguu Reader browser
            extension.
          </p>
          <FullWidthImage
            src={"find-extension.png"}
            alt={"Zeeguu browser extension"}
          />
        </Main>
        <Footer>
          <ButtonContainer buttonCountNum={1}>
            <GoToButton
              onClick={() => {
                redirect(getExtensionInstallationLinks());
              }}
            >
              <FileDownloadOutlinedIcon fontSize="small" />
              Install the Extension
            </GoToButton>
          </ButtonContainer>
        </Footer>
      </Modal>
    );
  } else return null;
}
