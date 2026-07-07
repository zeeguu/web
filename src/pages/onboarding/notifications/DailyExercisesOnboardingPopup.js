import * as s from "./DailyExercisesOnboardingPopup.sc";
import Main from "../../../components/modal_shared/Main.sc";
import OnboardingModal from "./OnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";

export default function DailyExercisesOnboardingPopup({ open, handleCancel }) {
  return (
    <OnboardingModal
      open={open}
      handleCancel={handleCancel}
      onboardingMessageId={ONBOARDING_MESSAGE_IDS.dailyExercises}
    >
      <Main>
        <s.CenteredText>Your daily exercises will appear here.</s.CenteredText>
        <s.DailyExercisesImage src="/static/images/dailyExercisesOnboarding.png" alt="Daily exercises illustration" />
        <s.CenteredSecondText>P.S. They are based on your translations from the articles.</s.CenteredSecondText>
      </Main>
    </OnboardingModal>
  );
}
