import * as s from "./ListeningOnboardingPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function ListeningOnboardingPopup({ open, handleCancel }) {
  const api = useContext(APIContext);
  const onboardingMessageId = ONBOARDING_MESSAGE_IDS.listening;

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
      <Main>
        <s.CenteredText>
          You can generate one listening lesson per day based on your vocabulary, topic or situation.
        </s.CenteredText>
      </Main>
      <s.ListeningImage src="/static/images/generateLessonOnboarding.png" alt="Generate Lesson illustration" />
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
