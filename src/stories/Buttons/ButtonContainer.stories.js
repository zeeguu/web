import React from "react";
import ButtonContainer from "../../pages/_pages_shared/ButtonContainer";
import Button from "../../pages/_pages_shared/Button";

export default {
  title: "Buttons/ButtonContainer",
  component: ButtonContainer,
};

export const Default = {
  render: () => (
    <ButtonContainer>
      <Button>Continue</Button>
    </ButtonContainer>
  ),
};

export const Link = {
  render: () => (
    <ButtonContainer>
      <a className="link" href="#">
        Learn more
      </a>
    </ButtonContainer>
  ),
};

export const AdaptiveAlignmentHorizontal = {
  render: () => (
    <ButtonContainer className="adaptive-alignment-horizontal">
      <Button>Continue</Button>
    </ButtonContainer>
  ),
};

export const VerticalPaddingMedium = {
  render: () => (
    <ButtonContainer className="padding-medium">
      <Button>Continue</Button>
    </ButtonContainer>
  ),
};

export const VerticalPaddingLarge = {
  render: () => (
    <ButtonContainer className="padding-large">
      <Button>Continue</Button>
    </ButtonContainer>
  ),
};
