import Box from "@mui/material/Box";
import styled from "styled-components";

//This component is a first step toward factoring the modal wrapper out (formerly MyBox).

const ModalWrapper = styled(Box)`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  max-width: 500px;
  background-color: white;
  border: 0 !important;
  border-radius: 0.65em;
  padding: 32px 48px 32px 48px;
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  outline: none !important;

  @media (max-width: 1200px) {
    max-width: 500px;
    width: 80%;
  }

  @media (max-width: 576px) {
    padding: 32px 24px;
    width: 80%;
  }

  h1 {
    font-size: 1.3em;
    text-align: center;
    @media (max-width: 576px) {
      text-align: left;
    }
  }

  a {
    text-align: center;
  }
`;

export { ModalWrapper };
