import styled from "styled-components";
import {
  alertGreen,
  zeeguuDarkRed,
  zeeguuOrange,
  zeeguuTransparentLightOrange,
  zeeguuWarmYellow,
} from "../../components/colors";
import StyledButton from "../exerciseTypes/Exercise.sc";

const FeedbackHolder = styled.div`
  display: flex;
  background-color: rgba(211, 211, 211, 0.139);
  border: 0px;
  border-radius: 0.5em;

  width: 100%;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
`;

const FeedbackButtonsHolder = styled.div`
  display: flex;

  width: 100%;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const FeedbackButton = styled(StyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  margin: 0.3em;
  font-size: 0.875em;
  background-color: ${zeeguuTransparentLightOrange};
  outline: none;

  &.selected {
    background-color: ${zeeguuOrange};
    border: 0.125em solid ${zeeguuOrange};
  }
`;

const FeedbackSelector = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: -1em;
`;

const FeedbackLabel = styled.label`
  font-size: 0.875em;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0.3em;
  margin-left: 1.5em;
  margin-right: 1.5em;
  &:hover {
    text-decoration: underline;
  }
`;

const FeedbackInstruction = styled.p`
  font-size: 0.875em;
  margin-left: 0.5em;
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const FeedbackInput = styled.input`
  margin-left: 1em;
`;

const FeedbackSubmit = styled.input`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  margin: 0.3em;
  font-size: 0.875em;
  background-color: ${zeeguuOrange};
  border: 0.2em solid ${zeeguuOrange};
  font-weight: 550;
  padding: 0.5em 0.8em;
  border-radius: 0.65em;
  padding: 0.5em;
  user-select: none;
  outline: none;
`;

const FeedbackCancel = styled(FeedbackSubmit)`
  background-color: white;
  borderColor: ${zeeguuOrange};,
  font-weight: 450;
`;

const FeedbackDelete = styled(FeedbackSubmit)`
  margin-left: 1em;
  margin-top: 1em;
  max-width: 200px;
  text-align: center;
  background-color: white;
  border: 0.1em solid ${zeeguuDarkRed};
  color: ${zeeguuDarkRed};
  font-weight: 450;
`;

const UndoButton = styled.button`
  margin-left: 1em;
  background-color: ${alertGreen};
  border: none;
  color: ${zeeguuWarmYellow}; //red will not work for color blind people on green background
  font-weight: bold;
  cursor: pointer;
`;

export {
  FeedbackHolder,
  FeedbackButtonsHolder,
  FeedbackButton,
  FeedbackLabel,
  FeedbackSelector,
  FeedbackInstruction,
  FeedbackForm,
  FeedbackDelete,
  FeedbackInput,
  FeedbackSubmit,
  FeedbackCancel,
  UndoButton,
};
