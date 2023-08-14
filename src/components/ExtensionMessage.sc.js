import {
  ModalWrapperGlobal,
  CloseButtonGlobal,
  ModalHeaderGlobal,
  ModalBodyGlobal,
  ModalFooterGlobal,
} from "./ModalGlobalStyling.sc"; //file responsible for modal global styles settings
import styled from "styled-components";

const ModalWrapper = styled(ModalWrapperGlobal)`
  .annotation {
    color: orange;
    font-weight: 500;
  }
`;

const Header = styled(ModalHeaderGlobal)``;

const Body = styled(ModalBodyGlobal)``;

const Footer = styled(ModalFooterGlobal)``;

const CloseButton = styled(CloseButtonGlobal)``;

const InstallLink = styled.div`
  display: flex;
  gap: 0.25em;
  align-items: flex-start;
`;

export {
  ModalWrapper,
  CloseButton,
  Header,
  Body,
  Footer,
  InstallLink,
};
