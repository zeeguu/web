import { ModalWrapper } from "./ModalWrapper.sc"; //factored out MyBox
import styled from "styled-components";

//TODO: after deciding on the final modal styling - this file and the RedirectionNotificationModal.sc
//could be merged together into one universal component

const ExtensionMessageModalWrapper = styled(ModalWrapper)`
  .annotation {
    color: orange; //hardcoded color but we need something in between ZeeguuOrange and ZeeguuDarkOrange
    font-weight: 500;
  }

  p {
    //TODO: write reasons for this line-height settings
    line-height: 150%;
    text-align: left;
    font-size: 1em;
    margin: 0;
  }

  h1 {
    margin: 0;
  }
`;

const Header = styled.div`
  margin: 1em 0;
  h1 {
    margin: 0;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  margin: 1em 0;
  .fullDivWidthImage {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  align-items: center;
  margin: 1em 0;
  a:hover {
    text-decoration: underline;
  }
`;

const InstallLink = styled.div`
  display: flex;
  gap: 0.25em;
  align-items: flex-start;
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

export {
  ExtensionMessageModalWrapper,
  CloseButton,
  Header,
  Body,
  Footer,
  InstallLink,
};
