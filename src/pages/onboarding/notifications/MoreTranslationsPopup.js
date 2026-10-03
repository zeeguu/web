import * as s from "./MoreTranslationsPopup.sc";
import Main from "../../../components/modal_shared/Main.sc";
import OnboardingModal from "./OnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function MoreTranslationsPopup({ open, handleCancel }) {
  return (
    <OnboardingModal
      open={open}
      handleCancel={handleCancel}
      onboardingMessageId={ONBOARDING_MESSAGE_IDS.moreTranslations}
    >
      <s.OnboardingImage src="/static/images/MoreTranslation.png" alt="See more translations illustration" />
      <Main>
        <s.CenteredText>
          Press <s.ArrowIcon src="/static/icons/ArrowDown.svg" alt="Arrow icon" /> to see more translation options, to
          unselect a word press <s.DeleteTranslationText>Delete translation.</s.DeleteTranslationText>
        </s.CenteredText>
      </Main>
    </OnboardingModal>
  );
}
