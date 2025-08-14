import { styled } from "@mui/material/styles";
import scStyled from "styled-components";
import { FeedbackButton } from "../exercises/exerciseTypes/Exercise.sc";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "0 !important",
  borderRadius: "0.65em",
  boxShadow: 24,
  p: 4,
};

const stylePhone = {
  ...style,
  width: "75%",
  maxHeight: "80%",
  overflow: "scroll",
};

let Headline = scStyled.h3`
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
  `;

let Small = scStyled.small`
  display: flex;
  justify-content: center;
  color: gray;
  font-style: italic;
  margin-top: 1em;
`;

let Paragraph = scStyled.p`
  margin-left: 0.3em;
  margin-bottom: 1.5em;
  font-style: italic;
`;

let DoneButtonHolder = scStyled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  
  @media (max-width: 800px) {
    flex-direction: column;
    gap: 1em;
    align-items: stretch;
    
    .save-cancel-buttons {
      justify-content: space-between !important;
    }
  }
`;

let EditButton = scStyled(FeedbackButton)`
  background-color: rgba(255,255,255,0);

  margin-left: -0.25em;

  img {
    height: 36px;
    width: 36px;
  }
`;

let CustomTextField = styled(TextField)`
  margin-top: 1em;
  margin-bottom: 1em;
`;

let CustomCheckBoxDiv = scStyled.div`
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5em;
  padding: 0px 0.5em;

  input {
    width: 1.3em;
    height: 1.3em;
  }
`;

let ExampleFieldContainer = scStyled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-top: 1em;
  margin-bottom: 1em;
  
  > div:first-child {
    flex: 1;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

let LinkContainer = scStyled.div`
  margin-bottom: 1em;
  padding-left: 0.5em;
`;

let ExampleFieldWrapper = scStyled.div`
  position: relative;
  margin-top: 1em;
  margin-bottom: 1em;
`;

let FloatingButton = scStyled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 1;
  
  .styledGreyButton,
  .remove-word-button {
    background-color: #f8f9fa !important;
    border: 1px solid #dee2e6 !important;
    color: #6c757d !important;
    padding: 0.25rem 0.5rem !important;
    border-radius: 0.25rem !important;
    text-decoration: none !important;
    font-size: 0.75rem !important;
    font-weight: 400 !important;
    cursor: pointer !important;
    transition: all 0.15s ease-in-out !important;
    margin: 0 !important;
    font-family: inherit !important;
    
    &:hover {
      background-color: #e9ecef !important;
      border-color: #adb5bd !important;
    }
    
    &:active {
      background-color: #dee2e6 !important;
      border-color: #adb5bd !important;
    }
  }
`;


let ButtonContainer = scStyled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2em;
  gap: 1em;
`;

let HelpText = scStyled.p`
  color: #666;
  font-size: 0.9em;
  font-style: italic;
  margin: 1em 0;
`;

let ExamplesContainer = scStyled.div`
  border: 1px solid #ddd;
  border-radius: 0.5em;
  padding: 1em;
  margin: 1em 0;
  background-color: #f9f9f9;
`;

let ExamplesHeading = scStyled.h4`
  margin: 0 0 0.5em 0;
  color: #333;
  font-size: 0.9em;
`;

let ExampleOption = scStyled.div`
  padding: 0.75em;
  margin: 0.5em 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &:active {
    background-color: #e0e0e0;
  }
`;

export {
  style,
  stylePhone,
  Headline,
  DoneButtonHolder,
  Small,
  Paragraph,
  EditButton,
  CustomTextField,
  CustomCheckBoxDiv,
  ExampleFieldContainer,
  LinkContainer,
  ExampleFieldWrapper,
  FloatingButton,
  ButtonContainer,
  HelpText,
  ExamplesContainer,
  ExamplesHeading,
  ExampleOption,
};
