import * as s from "./MoreTranslationsPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function MoreTranslationsPopup({ open, handleCancel }) {
  const api = useContext(APIContext);
  const onboardingMessageId = ONBOARDING_MESSAGE_IDS.moreTranslations;

  const handleDismiss = async () => {
    if (onboardingMessageId) {
      try {
        await api.markOnboardingMessageDismissed(onboardingMessageId);
      } catch (e) {
        // ignore dismissal recording failures
      }
    }
    if (handleCancel) handleCancel();
  };

  return (
    <Modal open={open} onClose={handleDismiss} wrapperBackgroundColor="var(--onboarding-modal-bg)" hideCloseButton>
      <s.MoreTranslationImage src="/static/images/MoreTranslation.png" alt="See more translations illustration" />
      <Main>
        <s.CenteredText>
          Press <s.ArrowIcon src="/static/icons/ArrowDown.svg" alt="Arrow icon" /> to see more translation options, to
          unselect a word press <s.DeleteTranslationText>Delete translation.</s.DeleteTranslationText>
        </s.CenteredText>
      </Main>
      <Footer>
        <ButtonContainer $buttonCountNum={1}>
          <s.OnboardingPrimaryButton $onboarding onClick={handleDismiss}>
            Continue
          </s.OnboardingPrimaryButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
