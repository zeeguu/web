import Modal from "@mui/material/Modal";
import * as s from "./RedirectionNotificationModal.sc";
import {
  isSupportedBrowser,
  isMobile,
} from "../../utils/misc/browserDetection";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

//This modal is used in the ArticlePreview component

export default function RedirectionNotificationModal({
  api,
  hasExtension,
  article,
  open,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  setIsArticleSaved, // related to the article's state
}) {
  function adaptNotificationType() {
    if (isSupportedBrowser() && hasExtension) {
      return "supported";
    } else if (isSupportedBrowser() && !hasExtension) {
      return "supportedNotInstalled";
    } else if (isMobile()) {
      return "mobile";
    } else if (!isSupportedBrowser() && !isMobile()) {
      return "unsupportedDesktop";
    }
  }

  return (
    <Modal open={open} onClose={handleCloseRedirectionModal}>
      <s.ModalWrapper>
        <Header notificationType={adaptNotificationType()} />
        <Body notificationType={adaptNotificationType()} />
        <Footer
          notificationType={adaptNotificationType()}
          article={article}
          api={api}
          setIsArticleSaved={setIsArticleSaved}
          handleCloseRedirectionModal={handleCloseRedirectionModal}
          setDoNotShowRedirectionModal_UserPreference={
            setDoNotShowRedirectionModal_UserPreference
          }
        />
      </s.ModalWrapper>
    </Modal>
  );
}
