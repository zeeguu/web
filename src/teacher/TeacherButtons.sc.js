import styled, { css } from "styled-components";
import { lightBlue, darkBlue } from "../components/colors";

const StyledButton = styled.button`
  user-select: none;
  display: inline-block;
  color: ${darkBlue};
  background-color: white;
  margin-top: 3px;
  margin-right: 0.5em;
  border-radius: 1.0625em;
  padding: 0.3125em 1.1875em;
  font-family: Montserrat;
  font-weight: 500;
  text-align: center;
  cursor: pointer;

  //Primary
  ${(props) =>
    props.primary &&
    css`
      color: white;
      background-color: ${darkBlue};
      border: 3px solid ${darkBlue};
    `}
  //Secondary
  ${(props) =>
    props.secondary &&
    css`
      border: 3px solid ${lightBlue};
    `}

  //Icon
  ${(props) =>
    props.icon &&
    css`
      display: flex;
      margin: 0;
      margin-top: -8px;
      padding: 0;
      border: None;
    `}

    //ChoiceNotSelected
    ${(props) =>
    props.choiceNotSelected &&
    css`
      border: 3px solid ${lightBlue};
    `}

        //ChoiceSelected
        ${(props) =>
    props.choiceSelected &&
    css`
      color: white;
      background: ${lightBlue};
      border: 3px solid ${lightBlue};
    `}
`;

const TopButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4em;
`;

const PopupButtonWrapper = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
`;

export { StyledButton, TopButtonWrapper, PopupButtonWrapper };
