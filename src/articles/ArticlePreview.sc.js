import styled from "styled-components";
import { zeeguuOrange, zeeguuDarkOrange } from "../components/colors";

const ArticlePreview = styled.div`
  position: relative;
  margin-bottom: 1em;
  margin-top: 2em;
  padding-left: 0.8em;
  padding-right: 0.8em;
  padding-bottom: 1em;
`;

// × in the card's top-right corner. Dismissal pattern (Twitter
// recommended, Instagram suggestions): small, muted, unmistakable. A
// generous 36px hit area via padding even though the visible glyph is
// small.
const HideButton = styled.button`
  position: absolute;
  top: 0.2em;
  right: 0.2em;
  width: 2.2em;
  height: 2.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1em;
  cursor: pointer;
  padding: 0;
  z-index: 1;
  &:active { color: var(--text-primary); }
`;

// Bookmark/save toggle overlaid on the image (top-right). Subtle dark
// circle scrim keeps the icon legible against any photo. Sibling of
// the image's Link so clicks here don't trigger navigation.
const SaveIconButton = styled.button`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  width: 2.8em;
  height: 2.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  &:active { background: rgba(0, 0, 0, 0.65); }
`;
/*
  The div contains the article preview contents
  and defines the size of the images relative to the
  user's screen size. Note this does not include the source/
  publishing time or topics.
*/

const ArticleContent = styled.div`
  width: 100%;
  display: flex;
  color: inherit;
  font-weight: inherit;

  @media (max-width: 990px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  gap: 0.5em;

  img {
    margin: 1em 0.5em 0 0.5em;
    max-width: 16em;
    max-height: 12em;
    border-radius: 1em;
    align-self: flex-start;
    object-fit: cover;

    @media (max-width: 990px) {
      align-content: center;
      justify-content: space-around;
      align-items: center;
      /* Fill the card width with a height cap so portrait photos
         don't dominate. width: 100% on the img stretches the parent
         ImageWithOverlay too, keeping the Open + Save overlays
         aligned to the corners of the visible image. */
      width: 100%;
      max-width: 100%;
      max-height: 13em;
      margin: 0.5rem 0;
    }
  }

  @media (max-width: 990px) {
    align-content: center;
    justify-content: space-around;
    align-items: center;
  }
`;

//Invisible component that allows to open the redirection
//notification modal when the article's title is clicked
//used within the titleLink(article) function
const InvisibleTitleButton = styled.button`
  font: inherit;
  color: inherit;
  text-align: left;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: none;
  border: none;
`;
//previously the color was defined as black and font-weight was 400 but dark orange was
//displayed and font-weight 500 because the article's title inside the titleLink(article) function
//was wrapped in a link tag and inherited its color and font weight settings.
//Currently the article's title is no longer wrapped in a link, this is why styling was updated
const ReadProgress = styled.span`
  font-size: medium;
  font-weight: 500;
  color: grey;

  &.complete {
    color: green;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  /* Reserve space for the absolutely-positioned Hide × button at the
     card's top-right so long titles wrap before reaching it. */
  padding-right: 2.2em;
`;

const Title = styled.div`
  font-size: 1.4em;
  color: var(--text-primary);
  padding-right: 0.3em;
  font-weight: 600;
  display: block;
  width: 100%;

  &.opened a {
    color: grey !important;

    &.completed {
    }
  }

  &.opened {
    color: grey !important;
  }
`;

const UrlSourceContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.3em 0px;
`;

const UrlSource = styled.span`
  font-size: 0.8em;
  font-style: italic;
  font-weight: 500;
`;

const UnfinishedArticleContainer = styled.div`
  margin-top: 0.5em;
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  gap: 0.5em;

  img {
    margin: 0.5em;
    margin-left: 0;
    max-width: 8em;
    max-height: 8em;
    border-radius: 1em;
    align-self: center;
    object-fit: cover;
    @media (max-width: 990px) {
      display: none;
    }
  }
`;

const UnfinishedArticleStats = styled.div`
  font-weight: 550;
  margin-top: 0.5rem;
  margin-bottom: -0.75rem;
`;

let Summary = styled.div`
  font-size: 1.3em;
  color: var(--text-primary);
  line-height: 1.5em;
  margin-top: 0.36em;
  width: 40em;
  @media (max-width: 990px) {
    width: 100%;
  }
`;

// Wraps the article image so the "Open" overlay can be absolutely
// positioned over it. The container is inline-block so it shrinks to
// the image's actual rendered size.
const ImageWithOverlay = styled.div`
  position: relative;
  display: inline-block;
  line-height: 0;

  @media (max-width: 990px) {
    display: block;
    width: 100%;
  }
`;

// Subtle bottom gradient + "Open" label so the image visibly reads as
// tappable. pointer-events: none so clicks pass through to the
// wrapping Link/button/anchor that owns the navigation.
const ImageOpenOverlay = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.4em 0.6em 0.5em;
  text-align: right;
  color: #fff;
  font-size: 0.85em;
  font-weight: 500;
  letter-spacing: 0.02em;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  pointer-events: none;
  border-radius: 0 0 1em 1em;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  line-height: 1.2;
`;

// Two-line clamp applied to the summary block when collapsed. Words
// still exist in the DOM (TranslatableText keeps per-word handlers
// alive) — only the visual is clipped.
const ClampedSummary = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Bigger tap target than a bare "more" link: ~44px tall via padding.
// Negative left margin keeps the visible label flush with the summary
// left edge while the surrounding hit-area extends outwards. Accent
// color makes it read as a link, not as muted body text.
const SummaryToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  margin-top: 0.1em;
  margin-left: -0.6em;
  padding: 0.5em 0.6em;
  background: none;
  border: none;
  font: inherit;
  font-size: 0.85em;
  font-weight: 500;
  color: var(--badge-text);
  cursor: pointer;
`;

let BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0.5em;
  justify-content: space-between;
  @media (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

let Topics = styled.span`
  span {
    height: 1.2em;
    margin-left: 0.2em;
    border: solid ${zeeguuOrange};
    border-radius: 2em;
    font-size: 0.85em;
    font-weight: 500;
    padding: 0.5em 1.35em;
    margin-bottom: 0.5em;
    text-align: center;
    vertical-align: middle;
  }
`;

export {
  Title,
  TitleContainer,
  UrlSource,
  UrlSourceContainer,
  ArticlePreview,
  UnfinishedArticleContainer,
  UnfinishedArticleStats,
  InvisibleTitleButton,
  ArticleContent,
  BottomContainer,
  Summary,
  ImageWithOverlay,
  ImageOpenOverlay,
  ClampedSummary,
  SummaryToggle,
  HideButton,
  SaveIconButton,
  Topics,
  ReadProgress,
};
