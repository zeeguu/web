import styled, { css } from "styled-components";
import { OrangeButton } from "./Exercise.sc.js";

let SpeakerImage = styled.div`
  &.small {
    padding-left: 0;
    padding-right: 0;
    margin-top: 0;
    margin-bottom: 0;
    height: 20px;
    width: 20px;
    background-color: red;
  }

  &.large {
    padding-left: 1.5em;
    padding-right: 1.5em;
    margin-top: -0.25em;
    margin-bottom: -0.25em;
    /* background-color: red; */
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
