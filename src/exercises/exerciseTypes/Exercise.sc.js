import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  zeeguuTransparentLightOrange,
  zeeguuOrange,
  darkGreen,
  zeeguuRed,
  zeeguuDarkOrange,
  darkBlue,
} from "../../components/colors";
import { green } from "@mui/material/colors";

const Exercise = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  transition: all 0.5s;
  padding-bottom: 1em;

  .headline {
    font-size: ;
    color: gray;
    margin-top: 1em;
  
    font-weight: 500;
  }

  .headlineWithMoreSpace {
    font-size: small;
    color: gray;
    margin-top: 3em;
    margin-bottom: 2em;
    
    /* font-weight: 600; */
  }

  .bottomInput {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;
    margin-top: 3em;
    flex-wrap: wrap;
  }

  .bottomInput button {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  .bottomInput input {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    text-align: center;
  }

  .highlightedWord {
    color: orange;
    font-weight: 800;
  }

  .headlineOrderWords {
    font-size: small;
    color: gray;
    margin-top: 1.5em;
    margin-bottom: 1em;


    /* font-weight: 600; */
    h2 {
      font-size: medium;
      margin-left:8px;
      margin-right:8px;
    }
  }

  .cluesRow {
    text-align: center;
    display: inline-block;
    margin-left: 0em;
    margin-top: -25px;
    
    h4 {
      margin-top: 0px;
      margin-bottom: 4px;
    }
    p {
      margin-bottom: 2px;
      margin-top: 0px;
    }

  }

  .orderWordsItem{
    display: flex;
    align-items: left;
    justify-content: left;
    min-height: 50px;
    flex-wrap: wrap;
    border-style: solid;
    border-radius: 16px;
    background-color: #dbdbdba6;
    border: 1px;
    padding: 5px 5px;
    margin-left: 30px;
    margin-right: 30px;
    margin-bottom: 1em;
    @media (max-width: 430px) {
      font-size: 14px;
    }
  }


  .incorrect {
    background-color: ${zeeguuRed};
    
  }

  .correct {
    background-color: ${darkGreen};
    :hover{ }
  }

  .swapModeBar {
    //background-color: ${darkBlue};
    background-color: #6db9d92b;
    margin: 0px 30px;
    border-top: 3px solid ${darkBlue};
    border-bottom: 3px solid ${darkBlue};
    border-radius: 5px;
    margin-bottom: 1em;
    text-align: center;
    font-size: large;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    min-height: 34px;
    p {
      text-align: center;
      margin: 0px;
      //color: white;
    }

    button {
      // Compensate the Margin
      font-size: small;
      font-weight: bold;
      margin-top: -2px;
      padding: 0.5em 0.5em;
      max-height: 28px;
    }
    @media (max-width: 430px) {
      font-size: 15px;
    }
  }

  .check {
      background-color: darkgreen;
      //outline: 3px darkgreen solid;
  }

  .undo {
      background-color: ${zeeguuRed};

  }

  .owButton{
    
    cursor: pointer;
    font-weight: 600;
    text-align: center;
    color: #fff;
    border: none;
    padding: 0.5em 0.5em;
    border-radius: 100px;
    box-shadow: 0px 2px #595959;

    :hover {filter: brightness(0.8);}

    :active {
      filter: brightness(0.5);
      box-shadow: 0 1px #666;
      transform: translateY(2px);
    }
  }

  .resetConfirmBar {
    //background-color: ${darkBlue};
    background-color: #ffbb545e;
    margin: 0px 30px;
    border-top: 3px solid ${zeeguuOrange};
    border-bottom: 3px solid ${zeeguuOrange};
    border-radius: 5px;
    margin-bottom: 1em;
    text-align: center;
    font-size: large;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    min-height: 34px;
    @media (max-width: 430px) {
      font-size: 16px;
    }
    p {
      text-align: center;
      margin: 0px;
      //color: white;
    }
    button {
      // Compensate the Margin
      font-size: small;
      margin-top: -2px;
      padding: 0.5em 0.5em;
      max-height: 28px;
    }

  }

  .toSwap {
    outline: 4px ${darkBlue} dashed;
    background-color: #6db9d92b !important;
    color: #000000bf;
  }

  .greyOut {
    background-color: #595959;
  }
  
  .disable {
    background-color: #595959;
    
    :hover{
      filter: brightness(1);
    }
    :active {
      filter: brightness(1);
      box-shadow: 0px 2px #595959;
      transform: translateY(0px);
    }
  }

  .contextExample {
    margin-top: 1em;
    margin-left: 2em;
    margin-right: 2em;
    font-weight: 400;
    line-height: 1.4em;
  }

  /* Mobile version */
  @media screen and (max-width: 768px) {
    .contextExample {
      margin-top: 0.5em;
      margin-left: 0.5em;
      margin-right: 0.5em;
    }

    .bottomInput {
      margin-top: 0.5em;
    }

    .bottomInput input {
      width: 6em;
    }

    h1 {
      margin-top: 0px;
      margin-bottom: 0px;
    }
  }
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 0.5em;
  font-weight: 500;
  border-radius: 0.625em;
  border-style: none;
  user-select: none;
`;

let MatchInputHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

let MatchButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-evenly;
`;

let MatchButtonHolderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
`;

let MatchSpeakButtonHolder = styled.div`
  width: fit-content;
  margin-left: -1.5em;
  border-radius: 0.75em;
`;

let MatchButton = styled(StyledButton)`
  width: fit-content;
  margin-top: 2em;
  margin-bottom: 2em;
  background: #ffd04799;
  color: black;
  border: 0.125em solid ${zeeguuTransparentLightOrange};

  &:focus {
    outline: 0;
  }

  &:hover {
    background-color: ${zeeguuTransparentLightOrange};
  }
`;

let MatchingWords = styled.p`
  margin-top: 2.125em;
  margin-bottom: 2.125em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  font-size: 1.125em;
  margin-right: 1em;
`;

let OrangeButton = styled(StyledButton)`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  color: white;
  background-color: ${zeeguuOrange};
  margin: 1em;
`;

let OrangeItemCompact = styled(StyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: normal !important;
  color: white;
  height: 34px;
  background-color: ${zeeguuOrange};
  margin: 0.2em 0.2em;
  padding: 0.5em 0.5em;
  box-shadow: 0 1px #666;
  &:hover {
    filter: brightness(0.8);
  }
  &:active {
      filter: brightness(0.5);
      box-shadow: 0 0.5px #666;
      transform: translateY(1px);
    }
  
`;

let OrangeItemCompactConstruct = styled(StyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: normal !important;
  align-items: center;
  color: white;
  height: 30px;
  background-color: ${zeeguuOrange};
  margin: 0.05em;
  padding: 0.5em 0.5em;
  & .correct :hover {
  }

  & .toSwap {
    color:black;
  }
  @media (max-width: 430px) {
    font-size: 10px;
  }
  /*
  & .feedbackText {
    visibility: hidden;
    width: 150px;
    overflow: visible;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    /* Position the tooltip 
    position: absolute;
    z-index: 1;
    margin-bottom: 110px;
  }

  &:hover .feedbackText {
    visibility: visible;
  }
  */
`;

let OrangeButtonMessage = styled(StyledButton)`
  display: flex;
  flex-direction: column;
  width: fit-content;
  justify-content: center;
  align-items: center;

  color: black;
  background-color: ${zeeguuOrange};
  margin: 1em;
`;

let FeedbackButton = styled(OrangeButton)`
  height: fit-content;
  width: fit-content;
  outline: none;

  &:disabled {
    cursor: default;
    text-decoration: line-through;
  }
`;

let LeftFeedbackButton = styled(FeedbackButton)`
  margin: 1em;

  @media (max-width: 430px) {
    order: 1;
  }
`;

let RightFeedbackButton = styled(FeedbackButton)`
  margin: 1em;

  @media (max-width: 430px) {
    order: 2;
  }
  @media (max-width: 250px) {
    order: 3;
  }
`;

const shake = keyframes`
10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

let AnimatedOrangeButton = styled(OrangeButton)`
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  margin: 1em;
`;

let AnimatedMatchButton = styled(MatchButton)`
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
`;

let Input = styled.input`
  height: 1.5em;
  text-align: center;

  @media (max-width: 430px) {
    order: 3;
  }
  @media (max-width: 250px) {
    order: 2;
  }
`;

let AnimatedInput = styled(Input)`
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;

  @media (max-width: 430px) {
    order: 3;
  }
  @media (max-width: 250px) {
    order: 2;
  }
`;

let BottomRow = styled.div`
  display: flex;
  padding: 0.5em;
  align-items: center;
  justify-content: space-around;
  margin-top: 3em;
  margin-bottom: 3em;

  @media (max-width: 430px) {
    flex-flow: row wrap;
  }
`;

let BottomRowCompact = styled.div`
  display: flex;
  padding: 0.5em;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 3em;

  @media (max-width: 430px) {
    flex-flow: row wrap;
  }
`;

let ItemRowCompactWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0.5em;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1em;
  @media (max-width: 430px) {
    flex-flow: row wrap;
  }
`;
let ItemRowCompactWrapConstruct = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0.3em;
  align-items: left;
  min-height:64px;
  //justify-content: ;
  margin-bottom: 0.1em;
  @media (max-width: 430px) {
    flex-flow: row wrap;
  }
`;

let StyledGreyButton = styled.button`
  background: none !important;
  border: none !important;
  padding: 0 !important;
  margin-top: 1em;
  color: gray;
  text-decoration: underline;
  font-size: small !important;
  font-weight: 500;
  cursor: pointer;
  font-family: "Montserrat";
`;

let StyledDiv = styled.div`
  margin-top: 1em;
  color: gray;
`;

let ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

let CenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

let CenteredRowTall = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1.5em;
`;

let EditSpeakButtonHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export {
  Exercise,
  FeedbackButton,
  OrangeButton,
  OrangeItemCompact,
  OrangeItemCompactConstruct,
  AnimatedOrangeButton,
  Input,
  AnimatedInput,
  BottomRow,
  BottomRowCompact,
  ItemRowCompactWrap,
  ItemRowCompactWrapConstruct,
  StyledGreyButton,
  StyledDiv,
  MatchButton,
  MatchingWords,
  AnimatedMatchButton,
  MatchButtonHolder,
  MatchButtonHolderRight,
  MatchInputHolder,
  MatchSpeakButtonHolder,
  ButtonRow,
  CenteredRow,
  CenteredRowTall,
  LeftFeedbackButton,
  RightFeedbackButton,
  EditSpeakButtonHolder,
  OrangeButtonMessage,
};

export default StyledButton;
