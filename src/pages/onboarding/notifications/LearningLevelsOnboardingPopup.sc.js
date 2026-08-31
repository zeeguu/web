import styled from "styled-components";

// Shared onboarding centered text plus the level-indicator wrapper that is
// unique to this popup.
export { CenteredText, CenteredSecondText } from "./OnboardingModal.sc";

const LevelIndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 280px;
  margin: 20px auto;

  .progress-bar {
    height: 10px;
    border-radius: 8px;
  }

  .level-circle {
    width: 20px;
    height: 20px;
    font-size: 12px;
    border: 2px solid var(--progress-circle-border, #c4c4c4);
  }

  .level-circle.final {
    width: 24px;
    height: 24px;
  }

  .level-circle.filled::before {
    width: 8px;
    height: 8px;
  }
`;

export { LevelIndicatorWrapper };
