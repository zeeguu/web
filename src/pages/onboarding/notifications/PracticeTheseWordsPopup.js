import * as s from "./OnboardingModal.sc";
import Main from "../../../components/modal_shared/Main.sc";
import OnboardingModal from "./OnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function PracticeTheseWords({ open, handleCancel }) {
  return (
    <OnboardingModal
      open={open}
      handleCancel={handleCancel}
      onboardingMessageId={ONBOARDING_MESSAGE_IDS.practiceTheseWords}
    >
      <s.OnboardingImage
        src="/static/images/practiceTheseWordsOnboarding.png"
        alt="Practice These Words illustration"
      />
      <Main>
        <s.CenteredText>You can practice new words directly from here!</s.CenteredText>
      </Main>
    </OnboardingModal>
  );
}
