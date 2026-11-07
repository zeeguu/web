import styled from "styled-components";
import { StyledButton } from "../../../components/allButtons.sc";

const OnboardingPrimaryButton = styled(StyledButton)`
  min-width: 190px;
  margin: 0 auto;
`;

// Illustration shown in the onboarding popups. Pass $tightTop when the image
// sits between two text lines and shouldn't add extra space above it.
const OnboardingImage = styled.img`
  width: min(100%, 300px);
  display: block;
  margin: ${(props) => (props.$tightTop ? "0" : "20px")} auto 0;
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

export { OnboardingPrimaryButton, OnboardingImage, CenteredText, CenteredSecondText };
