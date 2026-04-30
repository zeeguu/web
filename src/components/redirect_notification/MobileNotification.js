import * as s from "../modal_shared/Modal.sc";
import { useContext, useState } from "react";
import Modal from "../modal_shared/Modal";
import Header from "../modal_shared/Header.sc";
import Heading from "../modal_shared/Heading.sc";
import Main from "../modal_shared/Main.sc";
import Footer from "../modal_shared/Footer.sc";
import ButtonContainer from "../modal_shared/ButtonContainer.sc";
import Checkbox from "../modal_shared/Checkbox";
import { StyledButton } from "../allButtons.sc";
import ShareAndroid from "@mui/icons-material/Share";
import IosShareIcon from "@mui/icons-material/IosShare";
import redirect from "../../utils/routing/routing";
import { APIContext } from "../../contexts/APIContext";

export default function MobileNotification({
  article,
  setIsArticleSaved,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  mobilePlatform = "mobile",
  open,
}) {
  const api = useContext(APIContext);
  const [redirectCheckbox, setRedirectCheckbox] = useState(false);

  function toggleRedirectCheckbox() {
    setRedirectCheckbox(!redirectCheckbox);
  }

  function saveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
      }
    });
  }

  //this state is saved to local storage
  function handleModalVisibilityPreferences() {
    redirectCheckbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  //runs when user enters article or saves it
  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  function handleOpenArticle(article) {
    handleSaveVisibilityPreferences(); //if user checked "Don't show this message again" or not
    redirect(article.parent_url || article.url);
  }

  // function below saves article, visibility preferences of the modal and closes it
  function handleSaveArticleFromTheModal() {
    saveArticle();
    handleSaveVisibilityPreferences();
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state
  }

  const mobileHelpText = "and choose Zeeguu from the menu.";

  const shareIconStyles = {
    fontSize: "1.5rem",
    verticalAlign: "text-bottom",
    margin: "0 0.25rem",
  };

  const ShareIcon = mobilePlatform === "ios" ? IosShareIcon : ShareAndroid;

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>
        <Heading style={{textAlign:"center"}}>You will be redirected to the original article page</Heading>
      </Header>
      <Main>
        <p style={{textAlign:"center"}}>
          To read it with Zeeguu, tap
          <ShareIcon sx={shareIconStyles} />
          {mobileHelpText}
        </p>
      </Main>
      <Footer >
        <Checkbox
          label={"Don't show this message again"}
          checked={redirectCheckbox}
          onChange={toggleRedirectCheckbox}
        />
        <ButtonContainer $buttonCountNum={2}>
          <StyledButton $primary style={{ minWidth: "190px" }} onClick={() => handleOpenArticle(article)}>
            Continue
          </StyledButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
