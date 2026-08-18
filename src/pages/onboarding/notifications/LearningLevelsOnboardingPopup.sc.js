import styled from "styled-components";
import { StyledButton } from "../../../components/allButtons.sc";

const LevelIndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 280px;
  margin: 20px auto;
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
const OnboardingPrimaryButton = styled(StyledButton)`
  min-width: 190px;
  margin: 0 auto;
`;

export { LevelIndicatorWrapper, CenteredText, CenteredSecondText, OnboardingPrimaryButton };
