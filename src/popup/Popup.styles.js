import styled, { css } from "styled-components";
import { zeeguuOrange } from "../zeeguu-react/src/components/colors";

export const PrimaryButton = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  width: 11em;
  height: 3em;
  padding: 0.5em;
  font-size: 1.2em;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  color: white !important;
  background-color: #2f77ad !important;
  border-color: #3079b0 !important;
  :hover {
    background-color: #4f97cf !important;
  }
  margin-bottom: 1em !important;
  margin-top: 1em !important;
`;

export const PopUp = styled.div`
  font-weight: 600;
  display: flex;
  background-color: aqua;
  flex-direction: column;
  background-color: white;
  border-color: rgb(246, 246, 246);
  border-style: solid;
  border-width: 2px;
  padding: 10px;
  width: 230px;
  min-height: 180px;

  button {
    padding: 14px 20px;
    margin: 8px 0;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
  }
`;

export const BottomButton = styled.div`
  cursor: pointer;
  color: #2f77ad;
  font-weight: 500;
  position: relative;
  bottom: -0.4em;
  font-size: 1em !important;
  font-weight: 600 !important;
  :hover {
    color: #4f97cf !important;
  }
`;

export const NotifyButton = styled.button`
  background: none !important;
  border: none !important;
  padding: 0 !important;
  font-family: "Montserrat";
  cursor: pointer;
  color: #2f77ad;
  font-weight: 600 !important;
  :hover {
    color: #4f97cf !important;
  }
  font-size: 1em !important;

  //Small
  ${(props) =>
    props.disabled &&
    css`
      cursor: text;
      pointer-events: none;
      text-decoration: underline;
      color: #000 !important;
    `}
`;

export const HeadingContainer = styled.div`
  img {
    width: 15%;
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const MiddleContainer = styled.div`
  margin-bottom: 1.4em;
  h1 {
    margin-block-start: 0.5em !important;
    margin-block-end: 0.5em !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    text-align: center;
  }
  p {
    margin-block-start: 0em !important;
    margin-block-end: 0em !important;
    font-weight: normal;
    font-size: 1.2em !important;
  }
`;
