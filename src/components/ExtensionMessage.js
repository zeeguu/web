import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Heading from "./modal_shared/Heading";
import Main from "./modal_shared/Main";
import MainImage from "./modal_shared/MainImage";
import Footer from "../pages/info_page_shared/Footer";
import ButtonContainer from "./modal_shared/ButtonContainer";
import GoToButton from "./modal_shared/GoToButton";
import { getExtensionInstallationLinks } from "../utils/misc/extensionCommunication";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
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
          <MainImage
            src={"../static/images/find-extension.png"}
            alt={"Zeeguu browser extension"}
          />
        </Main>
        <Footer>
          <ButtonContainer buttonCountNum={1}>
            <GoToButton
              target={"_blank"}
              href={getExtensionInstallationLinks()}
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
