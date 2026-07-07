import styled from "styled-components";

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

const CenteredText = styled.p`
  && {
    text-align: center;
    font-weight: 500;
  }
`;

const CenteredSecondText = styled.p`
  && {
    text-align: center;
    font-weight: 500;
    font-size: 14px;
  }
`;

export { LevelIndicatorWrapper, CenteredText, CenteredSecondText };
