import Box from "@mui/material/Box";
import styled from "styled-components";

const MyBox = styled(Box)`
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
  padding: 48px;
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  outline: none !important;

  @media (max-width: 1200px) {
    max-width: 500px;
    width: 80%;
  }

  @media (max-width: 576px) {
    padding: 48px 24px;
    width: 80%;
  }

  h1 {
    line-height: 150%;
    text-align: center;
    font-size: 1.3em;
    margin: 0;
  }

  a {
    text-align: center;
  }

  p {
    //TODO: write reasons for this line-height settings
    line-height: 150%;
    text-align: left;
    font-size: 1em;
    margin: 0;
  }
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2em;
  margin: 2em 0;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const StyledCloseButton = styled.div`
  cursor: pointer;
  padding: 1px;
  text-align: right;
  position: absolute;
  float: right;
  right: 16px;
  margin-top: -30px;
`;

export { MyBox, StyledCloseButton, BodyContainer };
