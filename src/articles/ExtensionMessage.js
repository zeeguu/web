import Modal from "../components/modal_shared/Modal";
import { Header } from "../components/modal_shared/Header.sc";
import { Heading } from "../components/modal_shared/Heading.sc";
import { Main } from "../components/modal_shared/Main.sc";
import FullWidthImage from "../components/FullWidthImage";
import { Footer } from "../components/modal_shared/Footer.sc";
import { ButtonContainer } from "../components/modal_shared/ButtonContainer.sc";
import { Button } from "../pages/_pages_shared/Button.sc";
import { getExtensionInstallationLinks } from "../utils/extension/extensionInstallationLinks";
import { isSupportedBrowser } from "../utils/misc/browserDetection";
import {
  isMobile,
  runningInChromeDesktop,
} from "../utils/misc/browserDetection";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import redirect from "../utils/routing/routing";
import { getExtensionInstallationButtonContent } from "../utils/extension/extensionInstallationButtonContent";

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
            To start reading and translating articles recommended by&nbsp;Zeeguu
            or&nbsp;other sources, simply install The Zeeguu Reader
            browser&nbsp;extension!
          </p>
          <FullWidthImage
            src={"find-extension.png"}
            alt={"Zeeguu browser extension"}
          />
          {runningInChromeDesktop() && (
            <p className="small">
              * Also compatible with <b>Edge</b>, <b>Opera</b>, <b>Vivaldi</b>,
              and <b>Brave</b>. <br></br> Not seeing your browser? The extension
              may still work - try installing it!
            </p>
          )}
        </Main>
        <Footer>
          <ButtonContainer buttonCountNum={1}>
            <Button
              className="small"
              onClick={() => {
                redirect(getExtensionInstallationLinks());
              }}
            >
              {getExtensionInstallationButtonContent()}
              <ArrowForwardRoundedIcon fontSize="small" />
            </Button>
          </ButtonContainer>
        </Footer>
      </Modal>
    );
  } else return null;
}
