import Modal from "../../../components/modal_shared/Modal";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { OnboardingPrimaryButton } from "./OnboardingModal.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";

/**
 * Shared shell for the onboarding notification popups.
 *
 * Renders the onboarding-styled Modal, records the dismissal for the given
 * onboardingMessageId, and provides the single "Continue" button. Each popup
 * only supplies its own body via children.
 */
export default function OnboardingModal({ open, handleCancel, onboardingMessageId, children }) {
  const api = useContext(APIContext);

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
      {children}
      <Footer>
        <ButtonContainer $buttonCountNum={1}>
          <OnboardingPrimaryButton $onboarding onClick={handleDismiss}>
            Continue
          </OnboardingPrimaryButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
