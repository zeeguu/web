import * as s from "./DailyExercisesOnboardingPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function DailyExercisesOnboardingPopup({ open, handleCancel, onContinue }) {
  const api = useContext(APIContext);
  const onboardingMessageId = ONBOARDING_MESSAGE_IDS.dailyExercises;

  const handleDismiss = async () => {
    if (onboardingMessageId) {
      try {
        await api.markOnboardingMessageDismissed(onboardingMessageId);
      } catch (e) {
        // ignore dismissal recording failures
      }
    }
    if (handleCancel) {
      handleCancel();
    }
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <Modal open={open} onClose={handleDismiss} wrapperBackgroundColor="var(--onboarding-modal-bg)" hideCloseButton>
      <Main>
        <s.CenteredText>Your daily exercises will appear here.</s.CenteredText>
        <s.DailyExercisesImage src="/static/images/dailyExercisesOnboarding.png" alt="Daily exercises illustration" />
        <s.CenteredSecondText>P.S. They are based on your translations from the articles.</s.CenteredSecondText>
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
