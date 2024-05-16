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
  width: "40%",
  bgcolor: "background.paper",
  border: "0 !important",
  borderRadius: "0.65em",
  boxShadow: 24,
  p: 4,
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

export {
  style,
  Headline,
  DoneButtonHolder,
  Small,
  Paragraph,
  EditButton,
  CustomTextField,
};
