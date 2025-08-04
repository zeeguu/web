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
  justify-content: space-between;`;

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
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  z-index: 1;
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
};
