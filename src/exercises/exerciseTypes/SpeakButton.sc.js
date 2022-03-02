import styled, { css } from "styled-components";
import { OrangeButton } from "./Exercise.sc.js";

let SpeakerImage = styled.div`
  &.small {
    height: 20px;
    width: 20px;
  }

  &.large {
    height: 200px;
    width: 200px;
  }

  &.next {
    height: 75px;
    width: 75px;
  }
`;

// TODO: This is copy-pasted from FeedbackButton: figure out if all the properties are needed
let SpeakButton = styled(OrangeButton)`
  height: fit-content;
  width: fit-content;
  outline: none;

  &:disabled {
    cursor: default;
    text-decoration: line-through;
  }

  &#loader {
    background-color: green;
  }
`;

export { SpeakButton, SpeakerImage };
