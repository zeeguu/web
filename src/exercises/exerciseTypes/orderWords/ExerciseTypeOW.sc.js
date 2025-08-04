import styled from "styled-components";
import StyledButton from "../Exercise.sc";
import { zeeguuOrange, darkGreen, zeeguuRed, darkBlue } from "../../../components/colors";

const ExerciseOW = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  transition: all 0.5s;
  padding-bottom: 1em;


  .headlineOrderWords {
    font-size: small;
    font-weight: 600;
    color: gray;
    margin-top: 3em;
    margin-bottom: 1em;
  }

  .next-nav-feedback {
    margin-top:  1.5em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    img {
      width: 60px;
      mix-blend-mode: multiply;
      height: auto;
    }
    p {
      margin-left: 1em;
    }
  }

  .translatedText {
    font-size: medium !important;
    font-weight: 400;
    margin-left:8px;
    margin-right:8px;
    margin-top: 1em !important;
  }

  .solutionText {
    font-size: medium !important;
    color: gray;
    margin-right: 30px;
    margin-left: 30px;
  }

  .reduceContext {
    font-size: 10px;
    width: 80%;
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



  .cluesRow {
    text-align: center;
    display: inline-block;
    margin-top: -10px;
    margin-bottom: 2px;
    border-style: solid;
    border-width: 4px 0px 4px 0px;
    border-radius: 10px;
    border-color: #006400;
    background-color: #0064001c;
    margin-left: 10px;
    margin-right: 10px;
    
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
      font-size: 12px;
      margin-left:10px;
      margin-right:10px;
    }
    
  }

  .incorrect {
    background-color: ${zeeguuRed};
  }

  .correct {
    background-color: ${darkGreen};
    :hover{ 
      filter: brightness(1)
    }
  }

  .placeholder {
    font-size: x-large;
    border-radius: 1000px;
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
  .OWBottomRow{
    display:block
    padding: 0.5em;
    align-items: center;
    justify-content: space-around;
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 1em;
    margin-bottom: -3em;

    @media (max-width: 430px) {
      flex-flow: row wrap;
    }
  } 

  .owButton{
    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    font-weight: 600;
    text-align: center;
    color: #fff;
    border: none;
    padding: 0.5em 0.5em;
    border-radius: 100px;
    box-shadow: 0px 2px #595959;
    height:2em;
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
  
  .toDragLeft {
    box-shadow: -7px 0px 0px 2px ${darkBlue}, 0px 0px 0px 0px ${darkBlue};
    outline: 2px ${darkBlue} solid;
    filter: brightness(0.90);
    z-index:1;
  }

  .toDragRight {
    box-shadow: 0px 0px 0px 0px ${darkBlue}, 7px 0px 0px 2px ${darkBlue};
    outline: 2px ${darkBlue} solid;
    filter: brightness(0.90);
    z-index:1;
  }

  .renderDisable {
    display: none;
  }

  .moveItem {
    opacity: 0.7;
  }

  .elementHidden {
    cursor: default;
    background-color: rgb(161 161 161);
    color:rgb(161 161 161);
    :hover {
      filter: brightness(1);
    }
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

  .tipText{
    font-size:small
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

let OrangeItemCompact = styled(StyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: normal !important;
  color: white;
  height: 34px;
  touch-action: none;
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
  min-height: 64px;
  //justify-content: ;
  margin-bottom: 0.1em;
  @media (max-width: 430px) {
    flex-flow: row wrap;
    padding: 0.1em;
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
  touch-action: none;
  background-color: ${zeeguuOrange};
  margin: 0.05em;
  padding: 0.5em 0.5em;
  & .correct {
  }
  & .toSwap {
    color: black;
  }
  &:hover {
    filter: brightness(0.9);
  }
  @media (max-width: 430px) {
    font-size: 10px;
  }
`;

export { ExerciseOW, OrangeItemCompact, OrangeItemCompactConstruct, ItemRowCompactWrap, ItemRowCompactWrapConstruct };
