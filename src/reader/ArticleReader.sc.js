import styled from "styled-components";

import { BigSquareButton } from "../components/allButtons.sc";

import * as color from "../components/colors";

import {
  NarrowColumn,
  CenteredContent,
  ContentOnRow,
} from "../components/ColumnWidth.sc";

let ArticleReader = styled.div`
  /* border: 1px solid lightgray; */
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
`;

let Toolbar = styled.div`
  /* border: 1px solid wheat; */
  background-color: white;
  height: 110px;

  display: flexbox;
  flex-direction: row;
  justify-content: flex-end;

  button {
    width: 55px;
    height: 55px;
    background-color: #ffe086;
    border-style: none;
    box-shadow: none;
    border-radius: 10px;
    margin: 10px;
    padding: 1px;
    user-select: none;
  }

  button:focus {
    outline: none;
  }

  button.selected {
    background-color: #ffbb54;
  }

  .tooltiptext {
    visibility: hidden;
    color: #ffbb54;
  }

  button:hover .tooltiptext {
    visibility: visible;
  }
`;

let Title = styled.div`
  font-size: x-large;
  font-weight: 800;
  margin-top: 0.5em;
`;

let BookmarkButton = styled.div`
  cursor: pointer;
  float: right;
  img {
    height: 1.4em;
  }

  .tooltiptext {
    visibility: hidden;
    color: #ffbb54;
  }

  :hover .tooltiptext {
    visibility: visible;
  }
`;

let MainText = styled.div`
  font-size: 1.3em;
  line-height: 3em;
  padding: 0.2em;
`;

let _BottomButton = styled(BigSquareButton)`
  width: 5em;
  height: auto;
  display: inline-block;
`;

let WhiteButton = styled(_BottomButton)`
  background-color: white;
  color: orange !important;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 8em;
  @media (min-wdith: 768px) {
    width: 16em;
  }
`;

let OrangeButton = styled(_BottomButton)`
  background-color: orange;

  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  h1 {
    color: white;
  }
  a {
    color: white;
  }

  width: 8em;

  @media (min-wdith: 768px) {
    width: 16em;
  }
`;

let FeedbackBox = styled.div`
  border: 1px solid lightgray;
  background-color: #f8f8f8;
  border-radius: 1em;
  padding: 1em;
  padding-bottom: 1em;
  margin-top: 3em;

  @media (min-width: 768px) {
    width: 30em;
  }
  margin-left: auto;
  margin-right: auto;
  h2 {
    text-align: center;
  }
  h4 {
    text-align: center;
  }
  .selected {
    background-color: ${color.lightOrange} !important;
    color: white !important;
  }
`;

let ExtraSpaceAtTheBottom = styled.div`
  margin-bottom: 8em;
`;

let StickyButton = styled.button`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
`;

export {
  ArticleReader,
  Toolbar,
  Title,
  BookmarkButton,
  MainText,
  WhiteButton,
  OrangeButton,
  FeedbackBox,
  CenteredContent,
  ExtraSpaceAtTheBottom,
  NarrowColumn,
  ContentOnRow,
  StickyButton,
};
