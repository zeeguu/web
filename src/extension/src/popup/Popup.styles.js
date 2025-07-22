import styled, { css } from "styled-components";
import colors from "../colors";

export const PopUp = styled.div`
  font-weight: 600;
  display: flex;
  background-color: rgba(255, 223, 143, 0.49) !important;
  flex-direction: column;
  border: none;
  padding: 10px;
  width: auto;
  height: auto;
  min-height: 120px;
  border-radius: 10px;
  position: relative;
  marign: 50px;
`;

export const BottomButton = styled.div`
  cursor: pointer;
  color: ${colors.darkBlue};
  font-weight: 500;
  position: relative;
  bottom: -0.4em;
  font-size: 1em !important;
  font-weight: 600 !important;

  :hover {
    color: ${colors.hoverBlue} !important;
  }
`;

export const NotifyButton = styled.button`
  background: none !important;
  border: none !important;
  padding: 10px !important;
  font-family: "Montserrat";
  cursor: pointer;
  color: ${colors.darkBlue};
  font-weight: 600 !important;

  :hover {
    color: ${colors.hoverBlue} !important;
  }

  font-size: 1em !important;

  //Small
  ${(props) =>
    props.disabled &&
    css`
      cursor: text;
      pointer-events: none;
      text-decoration: underline;
      color: ${colors.black} !important;
    `}
`;

export const HeadingContainer = styled.div`
  img {
    width: 15%;
  }

  display: flex;
  justify-content: center;
  margin: 10px;
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
`;

export const MiddleContainer = styled.div`
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  h1 {
    margin-block-start: 0.5em !important;
    margin-block-end: 0.5em !important;
    font-size: 1.15rem !important;
    font-weight: 600 !important;
    text-align: center;
  }

  p {
    margin-block-start: 0em !important;
    margin-block-end: 0em !important;
    font-weight: normal;
    font-size: 1em !important;
  }
`;
