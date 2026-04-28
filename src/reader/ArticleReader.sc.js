import styled, { css } from "styled-components";
import { BigSquareButton } from "../components/allButtons.sc";

import { lighterBlue, lightGrey, zeeguuLightYellow, zeeguuOrange, zeeguuWarmYellow } from "../components/colors";

import { CenteredContent, ContentOnRow, NarrowColumn } from "../components/ColumnWidth.sc";

import { Link } from "react-router-dom";

let ArticleReader = styled.div`
  padding: 0px 0.5rem;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;

  h1 {
    font-size: 1.6em !important;
    font-weight: 800;
    line-height: 1.5;
  }

  h2 {
    font-size: 1.4rem !important;
  }

  h3 {
    font-size: 1.3rem !important;
  }

  h4,
  h5,
  h6 {
    font-size: 1.2rem !important;
  }

  hr {
    border-top: 1px solid var(--border-light);
  }
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

let TopbarButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0.5em;
`;

let TopReaderButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

let AuthorLinksContainer = styled.div`
  margin-top: 0.5em;
  margin-bottom: 2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

let ArticleTopics = styled.div`
  margin-top: 10px;
  margin-bottom: -20px;
  font-style: italic;
  font-size: small;
`;

let ArticleInfoContainer = styled.div`
  margin-top: 1em;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (max-width: 990px) {
    flex-direction: column;
    align-items: left;
    gap: 1.2rem;
  }
`;

let ArticleImgContainer = styled.div`
  display: flex;
  justify-content: center;
`;

let ArticleImg = styled.img`
  width: 100%;
  border-radius: 1em;
  margin-bottom: 1em;
`;

const ToolbarWrapper = styled.div`
  width: 100%;
  justify-content: flex-end;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--bg-primary);
  padding: 0.4rem 0 0.3rem;
`;

let Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;

  button.toolbar-btn {
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

  progress[value] {
    --color: linear-gradient(89.5deg, ${zeeguuOrange}, ${zeeguuLightYellow} 100%); /* the progress color */
    --background: white; /* invisible until progress fills in */

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    width: 100%;
    height: 1px;
    border-radius: 10em;
    background: var(--background);
    transition: all 0.1s linear 0s;
  }

  progress[value]::-webkit-progress-bar {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--background);
  }
  progress[value]::-webkit-progress-value {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--color);
  }
  progress[value]::-moz-progress-bar {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--color);
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
  font-size: 1.2em;
  line-height: 2em;
  padding: 0.2em;

  .textParagraph {
    margin-bottom: 1.2em;
  }

  /* Consecutive blockquote fragments should merge visually */
  > div:has(.textParagraph.blockquote) + div:has(.textParagraph.blockquote) {
    .textParagraph.blockquote {
      margin-top: 0;
    }
    .textParagraph.blockquote::before {
      content: none;
    }
  }

  /* Last blockquote in sequence gets bottom margin */
  > div:has(.textParagraph.blockquote):not(:has(+ div .textParagraph.blockquote)) {
    .textParagraph.blockquote {
      margin-bottom: 1.5em;
    }
  }
`;

let _BottomButton = styled(BigSquareButton)`
  width: 8em;
  height: auto;
  display: inline-block;
  &.slightlyLarger {
    width: 10em;
  }
`;

let OrangeButton = styled(_BottomButton)`
  background-color: orange;

  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;

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

  // Primary
  ${(props) =>
    props.$primary &&
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
    props.$secondary &&
    css`
      background-color: white !important;
      color: orange !important;
    `}
    // Disabled
    ${(props) =>
    props.$disabled &&
    css`
      background-color: white !important;
      color: #999999 !important;
      cursor: not-allowed;
      pointer-events: none;
      border-width: 0;
    `}
`;

let InteractiveBox = styled.div`
  border: 1px solid var(--border-light);
  background-color: var(--card-bg);
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  padding: 2em 0em 2em 0em;
  margin-top: 1em;
  align-items: center;
  justify-content: center;
  text-align: center;

  &.review-words {
    background-color: ${lighterBlue};
    border: none;
  }

  @media (min-width: 768px) {
    width: 30em;
  }
  margin-left: auto;
  margin-right: auto;

  h2,
  h3,
  h5,
  p {
    text-align: center;
  }
  .selected {
    background-color: ${zeeguuWarmYellow} !important;
    color: white !important;
  }
`;

let InvisibleBox = styled.div`
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  padding: 0.5em 0em 0em 0em;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 30em;
  }
  margin-left: auto;
  margin-right: auto;

  h2,
  h3,
  h5,
  p {
    text-align: center;
  }
`;

let ExtraSpaceAtTheBottom = styled.div`
  margin-bottom: 8em;
`;

let CombinedBox = styled.div`
  border: 1px solid var(--border-light);
  background-color: var(--bg-primary);
  border-radius: 0.5em;
  padding: 2em 0em 2em 0em;
  margin-top: 1em;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (min-width: 768px) {
    width: 30em;
  }
  margin-left: auto;
  margin-right: auto;

  h2,
  h3,
  h5,
  p {
    text-align: center;
  }
  .selected {
    background-color: ${zeeguuWarmYellow} !important;
    color: white !important;
  }
`;

const ReadingTime = styled.div`
  font-size: 0.9em;
  color: var(--text-muted);
  margin-bottom: 0.5em;
`;

const FeedbackOptionsRow = styled(CenteredContent)`
  width: 100%;
  box-sizing: border-box;
  padding: 0 1.5rem;
  gap: 1rem;

  /* Let ChoiceButtons share the row evenly and shrink below their natural
     8em on narrow viewports — three buttons + margins overflow otherwise. */
  > button {
    flex: 0 1 8em;
    min-width: 0;
    margin: 0;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
    gap: 0.5rem;
  }
`;

export {
  ArticleReader,
  ArticleTopics,
  ArticleImg,
  ArticleImgContainer,
  ReadingTime,
  AuthorLinksContainer,
  ArticleInfoContainer,
  TopReaderButtonsContainer,
  Toolbar,
  Title,
  BookmarkButton,
  MainText,
  OrangeButton,
  InteractiveBox,
  CenteredContent,
  ExtraSpaceAtTheBottom,
  NarrowColumn,
  ContentOnRow,
  NavigationLink,
  TopbarButtonsContainer,
  PlayerControl,
  InvisibleBox,
  CombinedBox,
  ToolbarWrapper,
  FeedbackOptionsRow,
};
