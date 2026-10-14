import styled, { css } from "styled-components";
import {
  lightBlue,
  darkBlue,
  lightGrey,
  veryLightGrey,
} from "../../components/colors";

const StyledButton = styled.button`
  user-select: none;
  display: inline-block;
  color: ${darkBlue};
  /* Buttons, not pills: a small radius, a thin outline in the text's own
     colour, and the page showing through. The old 17px radius and 3px light
     blue ring made every action look like a tag. */
  background-color: transparent;
  margin-right: 0.5em;
  border: 1.5px solid transparent;
  border-radius: 8px;
  padding: 0.4em 1em;
  font-family: Montserrat;
  font-weight: 600;
  text-align: center;
  cursor: pointer;

  :disabled {
    background-color: ${lightGrey};
    border-color: ${lightGrey};
    color: white;
  }

  //Primary
  ${(props) =>
    props.$primary &&
    css`
      color: white;
      background-color: ${darkBlue};
      border-color: ${darkBlue};
    `}
  //Secondary
  ${(props) =>
    props.$secondary &&
    css`
      border-color: ${darkBlue};
    `}


  //deleteastudent 
  ${(props) =>
    props.deleteastudent &&
    css`
      padding-top: 4.5em !important;
    `}

  //isFirst
    ${(props) =>
    props.isFirst &&
    css`
      padding-top: 3.8em !important;
    `}

  //Naked
  ${(props) =>
    props.naked &&
    css`
      background-color: white;
      border: None;
      color: black;
      width: 100%;
    `}

  //Student view
  ${(props) =>
    props.studentView &&
    css`
      margin-top: 10px;
      max-height: 55px;
    `}
    
  //Icon
  ${(props) =>
    props.icon &&
    css`
      display: flex;
      padding: -4em;
      border: None;
      padding-top: 1.5em;
    `}

    //Link
    ${(props) =>
    props.link &&
    css`
      border: None;
      padding: 4px;
      text-decoration: underline;
      font-weight: 600;
      color: black;
      font-size: medium;
    `}


    //ChoiceNotSelected
    ${(props) =>
    props.choiceNotSelected &&
    css`
      border: 1.5px solid ${lightBlue};
    `}

    //ChoiceSelected
    ${(props) =>
    props.choiceSelected &&
    css`
      color: white;
      background: ${lightBlue};
      border: 1.5px solid ${lightBlue};
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
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-bottom: 1px solid ${veryLightGrey};
`;

export { StyledButton, TopButtonWrapper, PopupButtonWrapper };
