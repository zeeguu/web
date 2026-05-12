import * as s from "./ReviewWordsPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function ReviewWordsPopup({ open, handleCancel }) {
  const api = useContext(APIContext);
  const onboardingMessageId = ONBOARDING_MESSAGE_IDS.reviewWords;

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
      <s.ReviewWordsImage src="/static/images/ReviewWordsOnboarding.png" alt="Review words illustration" />
      <Main>
        <s.CenteredText>
          Tap <b>Review Words</b> to open your first Word List.
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
