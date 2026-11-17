import styled from "styled-components";

// Shared onboarding styles (image + centered text) plus the two elements that
// are unique to this popup.
export { OnboardingImage, CenteredText } from "./OnboardingModal.sc";

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  display: inline;
  margin: 0 4px;
  vertical-align: middle;
`;

const DeleteTranslationText = styled.b`
  @media (max-width: 576px) {
    display: block;
  }
`;

export { ArrowIcon, DeleteTranslationText };
