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
    font-size: 1.6rem !important;
    font-weight: 800;
    line-height: 1.25;
    /* Override the UA's ~0.67em h1 margins: a small gap below the toolbar,
       and keep the metadata tucked close beneath the title. */
    margin-top: 0.2rem;
    margin-bottom: 0.35rem;
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
  /* No horizontal padding here: the back-arrow button carries its own
     0.5rem padding, which then lands its icon box on the same column edge
     as the article content (ArticleReader has padding: 0 0.5rem). With the
     extra 0.5em the chevron floated ~3x deeper than the title beneath it. */
  padding: 0.5em 0;
  padding-left: 0.8em;
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
  /* Tuck the metadata right under the title — MetaStrip already carries its
     own 8px top margin, so this container adds none. */
  margin-top: 0;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
`;

let ArticleImgContainer = styled.div`
  display: flex;
  justify-content: center;
`;

let ArticleImg = styled.img`
  width: 100%;
  /* Cap the hero to a fraction of the viewport so it never dominates before
     any text shows, and scales down on small screens (a fixed rem doesn't).
     Taller sources are center-cropped to this banner; shorter ones keep their
     natural height. */
  max-height: 25vh;
  object-fit: cover;
  object-position: center;
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
    --background: transparent; /* genuinely invisible until progress fills in */

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    width: 100%;
    height: 1px;
    border-radius: 10em;
    background: var(--background);
    /* No transition — scroll updates already fire many times a second;
       animating each one fights the next and looks like the bar is
       "waiting for scroll to stop" before catching up. */
  }

  progress[value]::-webkit-progress-bar {
    border-radius: 10em;
    background: var(--background);
  }
  progress[value]::-webkit-progress-value {
    border-radius: 10em;
    background: var(--color);
  }
  progress[value]::-moz-progress-bar {
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
  /* 2em leading floated the lines too far apart to track comfortably; 1.7
     keeps room for the inline translation chips without the airy feel. */
  line-height: 1.7;
  padding: 0.2em;
  color: var(--text-primary);

  /* In dark mode the reading text was rendering near-white (~15:1 on the
     navy backdrop), which haloes and makes lines hard to follow. Settle it
     a touch below the heading's #e0e0e0 — ~11:1, still well past WCAG AAA
     but calmer for long-form reading. */
  :root[data-theme="dark"] & {
    color: #d2d2da;
  }

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

/* The reader scrolls edge-to-edge, so mid-article the body text runs right
   into the phone's curved bottom corner / home-indicator zone. This fixed
   sliver fades the bottom-most line into the page background over exactly
   that unsafe zone, so text dissolves instead of being hard-clipped by the
   curvature. (Matches the --safe-area-bottom convention used by BottomNav.) */
let BottomFade = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(0.5rem + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  pointer-events: none;
  z-index: 999;
  background: linear-gradient(to bottom, transparent, var(--bg-primary));
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
  BottomFade,
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
