import * as s from "./RedirectionNotificationModal.sc";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../../utils/misc/browserDetection";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Body from "./modal_shared/Body";
import Footer from "./modal_shared/Footer";
import IconHeader from "./modal_shared/Icon";

export default function SupportedNotificationNotInstalled({
  handleCloseRedirectionModal,
  open,
}) {
  function handleCancel() {
    handleCloseRedirectionModal();
  }

  function getInstallExtensionLinks() {
    if (runningInChromeDesktop()) {
      return "https://chrome.google.com/webstore/detail/the-zeeguu-reader/ckncjmaednfephhbpeookmknhmjjodcd";
    }
    if (runningInFirefoxDesktop()) {
      return "https://addons.mozilla.org/en-US/firefox/addon/the-zeeguu-reader/";
    }
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>
        <IconHeader src={"../static/images/zeeguuLogo.svg"} />
        The Zeeguu Reader<br></br>browser extension is not installed
      </Header>
      <Body>
        <p>
          For the best user experience we recommend you to read articles with{" "}
          <s.Strong>The Zeeguu Reader</s.Strong> browser extension.
        </p>
        <p>
          To read this article with the help of Zeeguu without the extension,
          simply click "Add to Saves" above the article's title.
        </p>
      </Body>
      <Footer>
        <s.ButtonsContainer ONE_BUTTON>
          <a
            target={"_blank"}
            rel="noreferrer"
            href={getInstallExtensionLinks()}
            className="link"
          >
            <s.GoToButton>
              <DownloadRoundedIcon fontSize="small" />
              Install the Extension
            </s.GoToButton>
          </a>
        </s.ButtonsContainer>
      </Footer>
    </Modal>
  );
}
