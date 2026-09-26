import * as s from "./OnboardingModal.sc";
import Main from "../../../components/modal_shared/Main.sc";
import OnboardingModal from "./OnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function ReviewWordsPopup({ open, handleCancel }) {
  return (
    <OnboardingModal open={open} handleCancel={handleCancel} onboardingMessageId={ONBOARDING_MESSAGE_IDS.reviewWords}>
      <s.OnboardingImage src="/static/images/ReviewWordsOnboarding.png" alt="Review words illustration" />
      <Main>
        <s.CenteredText>
          Tap <b>Review Words</b> to open your first Word List.
        </s.CenteredText>
      </Main>
    </OnboardingModal>
  );
}
