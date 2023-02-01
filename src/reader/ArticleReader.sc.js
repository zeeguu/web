import styled, { css } from "styled-components";

import { BigSquareButton } from "../components/allButtons.sc";

import {
  veryLightGrey,
  zeeguuLightYellow,
  zeeguuOrange,
  zeeguuVarmYellow,
} from "../components/colors";

import {
  NarrowColumn,
  CenteredContent,
  ContentOnRow,
} from "../components/ColumnWidth.sc";

import { Link } from "react-router-dom";

let ArticleReader = styled.div`
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
`;

let PlayerControl = styled.div`
  float: left;

  button {
    background-color: #aaaaff;
  }

  .buttonText {
    font-size: small;
    color: #aaaaff;
  }
`;

let RightHandSide = styled.div`
  float: right;
  button {
    background-color: ${zeeguuLightYellow};
  }
`;
let Toolbar = styled.div`
  height: 110px;
  // background-color: ${veryLightGrey};
  width: 100%;

  button {
    width: 55px;
    height: 55px;

    border-style: none;
    box-shadow: none;
    border-radius: 10px;
    margin: 10px;
    padding: 1px;
    user-select: none;
    cursor: pointer;
  }

  button:focus {
    outline: none;
  }

  button.selected {
    background-color: ${zeeguuOrange};
  }

  .tooltiptext {
    visibility: hidden;
    color: ${zeeguuOrange};
  }

  button:hover .tooltiptext {
    visibility: visible;
  }
`;

let Title = styled.div`
  font-size: x-large;
  font-weight: 800;
  margin-top: 0.5em;
  line-height: 2em;
`;

let BookmarkButton = styled.div`
  cursor: pointer;
  float: right;
  img {
    height: 1.4em;
  }

  .tooltiptext {
    visibility: hidden;
    color: ${zeeguuOrange};
  }

  :hover .tooltiptext {
    visibility: visible;
  }
`;

let MainText = styled.div`
  font-size: 1.3em;
  line-height: 2.3em;
  padding: 0.2em;

  .textParagraph {
    margin-bottom: 1em;
  }
`;

let _BottomButton = styled(BigSquareButton)`
  width: 8em;
  height: auto;
  display: inline-block;
`;

let WhiteButton = styled(_BottomButton)`
  background-color: white;
  color: orange !important;

  display: inline;
  align-items: center;
  justify-content: center;

  //Small
  ${(props) =>
    props.small &&
    css`
      font-size: 10px;
    `}

  // Gray
  ${(props) =>
    props.small &&
    css`
      color: hsla(21, 15%, 60%, 1) !important;
      border-color: hsla(21, 15%, 60%, 1);
      border-width: 1px;
      background-color: hsla(21, 15%, 99%, 1);
    `}
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

  @media (min-wdith: 768px) {
    width: 16em;
  }
`;

let NavigationLink = styled(Link)`
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 8em;
  min-height: 2em;
  padding: 0.5em;
  margin-left: 1em;

  @media (min-wdith: 768px) {
    width: 16em;
  }

  // Next
  ${(props) =>
    props.next &&
    css`
      :after {
        content: ">>";
      }
    `}
  // Previous
  ${(props) =>
    props.prev &&
    css`
      :before {
        content: " <<";
      }
    `}

  // Primary
  ${(props) =>
    props.primary &&
    css`
      background-color: orange !important;
      color: white !important;
      border-color: ${zeeguuOrange};
      border-style: solid;
      border-width: 2px;
      border-radius: 10px;
    `}
  // Secondary
  ${(props) =>
    props.secondary &&
    css`
      background-color: white !important;
      color: orange !important;
    `}
    // Disabled
    ${(props) =>
    props.disabled &&
    css`
      background-color: white !important;
      color: #999999 !important;
      cursor: not-allowed;
      pointer-events: none;
      border-width: 0;
    `}
`;

let FeedbackBox = styled.div`
  border: 1px solid lightgray;
  background-color: ${veryLightGrey};
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
    background-color: ${zeeguuVarmYellow} !important;
    color: white !important;
  }
`;

let ExtraSpaceAtTheBottom = styled.div`
  margin-bottom: 8em;
`;

const StickyVideo = styled.iframe`
  width: 100%;
  height: 40vh;
  max-height: 415px;
  position: sticky;
  top: 110px;
`

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
  NavigationLink,
  RightHandSide,
  PlayerControl,
  StickyVideo
};
