import * as s from "./LearningLevelsOnboardingPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { ONBOARDING_MESSAGE_IDS } from "../../../appConstants";
import LevelIndicator from "../../../exercises/progressBars/levelIndicator/LevelIndicator";

export default function LearningLevelsOnboardingPopup({ open, handleCancel }) {
  const api = useContext(APIContext);
  const onboardingMessageId = ONBOARDING_MESSAGE_IDS.learningLevels;

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
