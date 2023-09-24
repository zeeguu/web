import { ModalWrapper } from "./ModalWrapper.sc"; //responsible for modal wrapper background, size and scaling
import styled from "styled-components";

//Global modal content style settings

const ModalWrapperGlobal = styled(ModalWrapper)`
  h1 {
    font-size: 1.3em;
    line-height: 150%;
    text-align: center;
    font-weight: 700;
    margin: 0;
    @media (max-width: 576px) {
      text-align: left;
      font-size: 1.2em;
    }
  }

  p {
    line-height: 150%;
    text-align: left;
    font-size: 1em;
    margin: 0;
  }

  a {
    text-align: center;
  }
`;

const ModalHeaderGlobal = styled.div`
  margin: 1em 0;
  @media (max-width: 576px) {
    margin: 0.7em 0;
  }
`;

const ModalStrongTextWrapperGlobal = styled.div`
  margin: 0;
  display: inline;
  font-weight: 700;
`;

const ModalBodyGlobal = styled.div`
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
  @media (max-width: 576px) {
    margin: 0.7em 0;
  }
`;

const ModalFooterGlobal = styled.div`
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
  @media (max-width: 576px) {
    margin: 0.7em 0;
  }
`;

const CloseButtonGlobal = styled.div`
  cursor: pointer;
  padding: 1px;
  text-align: right;
  position: absolute;
  float: right;
  right: 16px;
  margin-top: -16px;
  @media (max-width: 576px) {
    right: 16px;
    margin-top: -8px;
  }
`;

export {
  ModalWrapperGlobal,
  CloseButtonGlobal,
  ModalHeaderGlobal,
  ModalBodyGlobal,
  ModalFooterGlobal,
  ModalStrongTextWrapperGlobal
};
