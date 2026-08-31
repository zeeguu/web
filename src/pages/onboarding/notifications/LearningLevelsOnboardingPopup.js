import * as s from "./LearningLevelsOnboardingPopup.sc";
import Main from "../../../components/modal_shared/Main.sc";
import OnboardingModal from "./OnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";
import LevelIndicator from "../../../exercises/progressBars/levelIndicator/LevelIndicator";

export default function LearningLevelsOnboardingPopup({ open, handleCancel }) {
  return (
    <OnboardingModal
      open={open}
      handleCancel={handleCancel}
      onboardingMessageId={ONBOARDING_MESSAGE_IDS.learningLevels}
    >
      <Main>
        <s.CenteredText>There are 4 levels of learning a word.</s.CenteredText>
        <s.LevelIndicatorWrapper>
          <LevelIndicator
            bookmark={{
              from: "example",
              level: 1,
              cooling_interval: 0,
              is_last_in_cycle: false,
            }}
            userIsCorrect={false}
            userIsWrong={false}
            isGreyedOutBar={false}
          />
        </s.LevelIndicatorWrapper>
        <s.CenteredSecondText>
          This bar shows your progress of learning a word. You will have different types of exercises on each level.
        </s.CenteredSecondText>
      </Main>
    </OnboardingModal>
  );
}
