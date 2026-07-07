import * as s from "./TranslationOnboardingPopup.sc";
import Main from "../../../components/modal_shared/Main.sc";
import OnboardingModal from "./OnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function TranslationOnboardingPopup({ open, handleCancel }) {
  return (
    <OnboardingModal open={open} handleCancel={handleCancel} onboardingMessageId={ONBOARDING_MESSAGE_IDS.translation}>
      <s.TranslationImage src="/static/images/translate.png" alt="Translation illustration" />
      <Main>
        <s.CenteredText>Tap on any word to translate it. Add at least 3 words to start learning them.</s.CenteredText>
      </Main>
    </OnboardingModal>
  );
}
