import * as s from "../modal_shared/Modal.sc";
import { getExtensionInstallationLinks } from "../../utils/extension/extensionInstallationLinks";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Modal from "../modal_shared/Modal";
import Header from "../modal_shared/Header";
import Heading from "../modal_shared/Heading";
import Main from "../modal_shared/Main";
import Footer from "../modal_shared/Footer";
import ButtonContainer from "../modal_shared/ButtonContainer";
import GoToButton from "../modal_shared/GoToButton";
import Icon from "../modal_shared/Icon";

export default function SupportedNotification_NotInstalled({
  handleCloseRedirectionModal,
  open,
}) {
  function handleClose() {
    handleCloseRedirectionModal();
    window.location.reload();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Header>
        <Heading>
          <Icon src={"../static/images/zeeguuLogo.svg"} />
          The Zeeguu Reader<br></br>browser extension is not installed
        </Heading>
      </Header>
      <Main>
        <p>
          For the best user experience we recommend you to read articles with{" "}
          <s.Strong>The Zeeguu Reader</s.Strong> browser extension.
        </p>
        <p>
          To read this article with the help of Zeeguu without the extension,
          simply click "Add to Saves" above the article's title.
        </p>
      </Main>
      <Footer>
        <ButtonContainer buttonCountNum={1}>
          <GoToButton target={"_blank"} href={getExtensionInstallationLinks()}>
            <DownloadRoundedIcon fontSize="small" />
            Install the Extension
          </GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
