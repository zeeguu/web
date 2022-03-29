import styled, { css } from "styled-components";
import { zeeguuOrange } from "../zeeguu-react/src/components/colors";
export const PopUpButton = styled.button`
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
  // Primary
  ${(props) =>
    props.primary &&
    css`
      color: white !important;
      background-color: #2f77ad !important;
      border-color: #3079b0 !important;
      :hover {
        background-color: #4f97cf !important;
      }
    `}
  // Disabled
    ${(props) =>
    props.disabled &&
    css`
      background-color: white !important;
      color: #999999 !important;
      cursor: not-allowed;
      border-color: #999999 !important;
      pointer-events: none;
    `}
`;

export const PopUp = styled.div`
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
    font-size: 1rem !important;
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

export const PopupButton = styled.div`
  cursor: pointer;
  color: #2f77ad;
  font-weight: 500;
  position: relative;
  bottom: -2em;
  font-size: 1em !important;
  font-weight: 600 !important;
  :hover {
    color: #4f97cf !important;
  }

  :only-child {
    left: 82%;
}
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

export const MiddleContainer = styled.div`
  font-weight: bold;
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
