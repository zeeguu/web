import { useState } from "react";
import WarningButton from "../components/modal_shared/WarningButton";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header";
import Heading from "../components/modal_shared/Heading";
import Main from "../components/modal_shared/Main";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "../components/modal_shared/ButtonContainer";
import * as s from "../components/FormPage.sc";
import redirect from "../utils/routing/routing";
import { APP_DOMAIN } from "../appConstants.js";
import SessionStorage from "../assorted/SessionStorage.js";
import { zeeguuRed } from "../components/colors.js";

export default function DeleteAccountButton({}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  function handleClick() {
    setShowConfirmationModal(!showConfirmationModal);
  }
  function handleUserConfirmation() {
    if (!SessionStorage.hasUserConfirmationForAccountDeletion()) {
      setShowConfirmationModal(false);
      SessionStorage.setUserConfirmationForAccountDeletion(true);
      redirect(APP_DOMAIN + "account_deletion");
    } else {
      setShowConfirmationModal(false);
    }
  }
  return (
    <>
      <Modal
        open={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
        }}
      >
        <Header>
          <p style={{ textAlign: "center", fontSize: "40px" }}>❗</p>
          <Heading>You are deleting your account</Heading>
        </Header>
        <Main>
          <p>
            This will delete all the data associated with your account. Texts
            you might have added will not be associated with your user anymore.
          </p>
          <p style={{ textAlign: "center" }}>
            If you need to contact us, please reach us at
            <a href="mailto:zeeguu@gmail.com"> zeeguu@gmail.com</a>
          </p>
          <p>
            <b>This action cannot be reverted.</b>
          </p>
        </Main>
        <Footer>
          <ButtonContainer buttonCountNum={1}>
            <WarningButton onClick={handleUserConfirmation}>
              Delete my account
            </WarningButton>
          </ButtonContainer>
        </Footer>
      </Modal>
      <s.DeleteAccountButton onClick={handleClick}>
        <span>Delete Account</span>
      </s.DeleteAccountButton>
    </>
  );
}
