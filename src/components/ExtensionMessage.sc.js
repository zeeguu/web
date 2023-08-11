import { ModalWrapper } from "./ModalWrapper.sc"; //factored out MyBox
import styled from "styled-components";

//TODO: after deciding on the final modal styling - this file and the RedirectionNotificationModal.sc
//could be merged together into one universal component

const ExtensionMessageModalWrapper = styled(ModalWrapper)`
  .newAnnotation {
    color: orange;
    font-weight: 500;
  }

  p {
    //TODO: write reasons for this line-height settings
    line-height: 150%;
    text-align: left;
    font-size: 1em;
    /* margin: 0; */
  }

  .install-links {
    display: flex;
    gap: 0.25em;
    align-items: flex-start;
  }
  .install-links:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  align-items: center;
  margin: 1em 0;
`;

const CloseButton = styled.div`
  cursor: pointer;
  padding: 1px;
  text-align: right;
  position: absolute;
  float: right;
  right: 16px;
  margin-top: -32px;
`;

export { ExtensionMessageModalWrapper, CloseButton, Footer };
