import * as s from "./PracticeTheseWordsPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function PracticeTheseWords({ open, handleCancel }) {
  const api = useContext(APIContext);
  const onboardingMessageId = ONBOARDING_MESSAGE_IDS.practiceTheseWords;

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
      <s.PracticeTheseWordsImage
        src="/static/images/practiceTheseWordsOnboarding.png"
        alt="Practice These Words illustration"
      />
      <Main>
        <s.CenteredText>You can practice new words directly from here!</s.CenteredText>
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
