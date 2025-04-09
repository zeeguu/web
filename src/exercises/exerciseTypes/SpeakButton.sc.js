import styled from "styled-components";
import { OrangeButton } from "./Exercise.sc.js";
import { blue900 } from "../../components/colors.js";

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
  padding: 5px;
  &:selected {
    background-color: ${blue900};
  }
  &:disabled {
    cursor: default;
    text-decoration: line-through;
  }
`;

export { SpeakButton, SpeakerImage };
