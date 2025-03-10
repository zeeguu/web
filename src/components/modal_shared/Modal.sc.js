import Box from "@mui/material/Box";
import styled from "styled-components";

//responsible for modal wrapper background, size and scaling
const ModalWrapper = styled(Box)`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  max-width: 500px;
  max-height: 90%;
  background-color: white;
  border: 0 !important;
  border-radius: 0.65em;
  padding: 32px 48px 32px 48px;
  box-shadow:
    0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%),
    0px 9px 46px 8px rgb(0 0 0 / 12%);
  outline: none !important;
  overflow: auto;

  p {
    width: 100%;
    line-height: 150%;
    text-align: left;
    font-size: 1rem;
    margin: 0;
  }

  p.small {
    font-size: 0.875rem;
  }

  p.extra-small {
    font-size: 0.8rem;
    color: gray;
  }

  a {
    text-align: center;
  }

  .link:hover {
    text-decoration: none;
  }

  .annotation {
    color: orange;
    font-weight: 500;
  }

  @media (max-width: 1200px) {
    max-width: 500px;
    width: 80%;
  }

  @media (max-width: 576px) {
    padding: 24px 24px;
    width: 80%;
  }
`;

const Strong = styled.span`
  margin: 0;
  display: inline;
  font-weight: 700;
`;

const CloseButton = styled.button`
  cursor: pointer;
  padding: 1px;
  text-align: right;
  position: absolute;
  float: right;
  border: none;
  background-color: inherit;
  right: 16px;
  margin-top: -16px;
  @media (max-width: 576px) {
    right: 16px;
    margin-top: -8px;
  }
`;

const ExternalLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

export { ModalWrapper, CloseButton, ExternalLink, Strong };
