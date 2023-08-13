import { ModalWrapper } from "./ModalWrapper.sc"; //factored out MyBox
import styled from "styled-components";

//TODO: Merge this and the RedirectionNotificationModal.sc into one component (ModalUniversal.sc for instance)
//as they share a lot of simillar code.

const ExtensionMessageModalWrapper = styled(ModalWrapper)`
  .annotation {
    color: orange;
    font-weight: 500;
  }

  p {
    line-height: 150%;
    text-align: left;
    font-size: 1em;
    margin: 0;
  }

  h1 {
    margin: 0;
    @media (max-width: 576px) {
      text-align: left;
    }
  }
`;

const Header = styled.div`
  margin: 1em 0;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  a {
    font-weight: 600;
  }
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
  margin-top: -16px;
`;

export {
  ExtensionMessageModalWrapper,
  CloseButton,
  Header,
  Body,
  Footer,
  InstallLink,
};
