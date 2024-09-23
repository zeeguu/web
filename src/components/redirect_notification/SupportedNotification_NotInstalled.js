import { getExtensionInstallationLinks } from "../../utils/extension/extensionInstallationLinks";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Modal from "../modal_shared/Modal";
import Header from "../modal_shared/Header";
import Heading from "../modal_shared/Heading";
import Main from "../modal_shared/Main";
import Footer from "../modal_shared/Footer";
import ButtonContainer from "../modal_shared/ButtonContainer";
import GoToButton from "../modal_shared/GoToButton";
import FullWidthImage from "../FullWidthImage";

export default function SupportedNotification_NotInstalled({
  handleCloseRedirectionModal,
  open,
}) {
  function handleCancel() {
    handleCloseRedirectionModal();
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>
        <Heading>
          Enable reading <br></br> and translating articles by installing
          The&nbsp;Zeeguu Reader browser extension
        </Heading>
      </Header>
      <Main>
        <FullWidthImage
          src={"use-extension.png"}
          alt={"Zeeguu browser extension"}
        />
        <p>
          To read this article with the help of Zeeguu without the extension,
          simply click "Add to Saves" above the article's title.
        </p>
      </Main>
      <Footer>
        <ButtonContainer buttonCountNum={1}>
          <GoToButton target={"_self"} href={getExtensionInstallationLinks()}>
            Install from Chrome Web Store
            <ArrowForwardRoundedIcon fontSize="small" />
          </GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
