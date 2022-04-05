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
  min-height: 190px;

  button {
    padding: 14px 20px;
    margin: 8px 0;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
  }

  .loader {
    margin-top: 25%;
    align-self: center;
    border: 6px solid #f4f4f6; /* Light grey */
    border-top: 6px solid ${zeeguuOrange}; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const HeadingContainer = styled.div`
  img {
    width: 15%;
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 17px;
`;

export const NotReadableContainer = styled.div`
  p {
    margin-block-start: 0em !important;
    margin-block-end: 0em !important;
    font-weight: normal;
    font-size: 1.2em!important;
  }

  button {
    margin-bottom: 25px;
  }
`;
