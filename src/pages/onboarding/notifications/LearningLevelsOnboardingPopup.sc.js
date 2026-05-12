import styled from "styled-components";
import { StyledButton } from "../../../components/allButtons.sc";

const LearningLevelsImage = styled.img`
  width: min(100%, 300px);
  display: block;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  object-fit: contain;

  @media (max-width: 576px) {
    width: min(100%, 280px);
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
const OnboardingPrimaryButton = styled(StyledButton)`
  min-width: 190px;
  margin: 0 auto;
`;

export { LearningLevelsImage, CenteredText, CenteredSecondText, OnboardingPrimaryButton };
