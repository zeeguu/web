import styled, { keyframes } from "styled-components";
import { almostBlack, zeeguuOrange, zeeguuTransparentMediumOrange, orange600 } from "../components/colors";

const TranslatableText = styled.div`
  /* MWE adjacent color - used for contiguous MWEs */
  --mwe-adjacent-color: rgb(200, 140, 60);
  --mwe-adjacent-bg: rgb(255, 240, 220);

  /* ========================================================================
   * BASE Z-TAG STYLES
   * ======================================================================== */
  z-tag {
    white-space: break-spaces;
    cursor: pointer;
    display: inline-block;
    margin: 0;
    line-height: 29px;
  }

  z-tag.number,
  z-tag.no-hover {
    cursor: default;
    &:hover {
      background-color: transparent !important;
    }
  }

  z-tag.punct {
    margin-left: -5.2px;
  }
  z-tag.left-punct {
    margin-left: 0px;
    margin-right: -5px;
  }
  z-tag.no-space {
    margin-right: -5px;
  }
  z-tag.no-margin {
    margin: 0px !important;
  }

  /* ========================================================================
   * LOADING ANIMATION
   * ======================================================================== */
  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  .loading {
    animation: blink 0.75s linear infinite alternate;
    color: ${zeeguuOrange};
  }

  /* ========================================================================
   * MWE (Multi-Word Expression) STYLES
   *
   * MWE Color System:
   * - Each MWE group gets a color (0-4) to visually connect related words
   * - Colors defined once as CSS variables, used everywhere
   *
   * MWE States:
   * - mwe-color-X: Base styling for translated MWE words (permanent)
   * - mwe-hover-hint: Subtle hint for untranslated MWEs (debug mode)
   * - mwe-hover-active: Highlight when hovering any MWE partner word
   * - mwe-loading: Pulsing animation while translating
   * ======================================================================== */

  /* --- MWE Color Definitions (single source of truth) --- */
  z-tag.mwe-color-0 {
    --mwe-color: rgb(130, 100, 200);
    --mwe-bg: rgba(130, 100, 200, 0.08);
    --mwe-bg-hover: rgba(130, 100, 200, 0.1);
    --mwe-tran-bg: rgb(220, 210, 245);
  }
  z-tag.mwe-color-1 {
    --mwe-color: rgb(70, 130, 200);
    --mwe-bg: rgba(70, 130, 200, 0.08);
    --mwe-bg-hover: rgba(70, 130, 200, 0.2);
    --mwe-tran-bg: rgb(210, 225, 250);
  }
  z-tag.mwe-color-2 {
    --mwe-color: rgb(0, 150, 150);
    --mwe-bg: rgba(0, 150, 150, 0.08);
    --mwe-bg-hover: rgba(0, 150, 150, 0.2);
    --mwe-tran-bg: rgb(200, 235, 235);
  }
  z-tag.mwe-color-3 {
    --mwe-color: rgb(80, 160, 80);
    --mwe-bg: rgba(80, 160, 80, 0.08);
    --mwe-bg-hover: rgba(80, 160, 80, 0.2);
    --mwe-tran-bg: rgb(215, 240, 215);
  }
  z-tag.mwe-color-4 {
    --mwe-color: rgb(200, 100, 150);
    --mwe-bg: rgba(200, 100, 150, 0.08);
    --mwe-bg-hover: rgba(200, 100, 150, 0.2);
    --mwe-tran-bg: rgb(250, 220, 235);
  }

  /* --- MWE Loading: All partner words pulse together --- */
  z-tag.mwe-loading {
    animation: blink 0.75s linear infinite alternate;
    color: var(--mwe-color, rgb(100, 100, 100)) !important;
  }
  z-tag.mwe-loading .loading,
  z-tag[class*="mwe-color-"] .loading {
    color: var(--mwe-color, rgb(100, 100, 100)) !important;
  }

  /* --- MWE Adjacent: Translated adjacent (non-separated) MWEs use darker orange --- */
  z-tag.mwe-adjacent {
    --mwe-color: var(--mwe-adjacent-color);
    --mwe-tran-bg: var(--mwe-adjacent-bg);
  }
  z-tag.mwe-adjacent z-orig {
    color: var(--mwe-adjacent-color) !important;
    font-weight: 600;
    text-decoration: underline dotted var(--mwe-adjacent-color);
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  z-tag.mwe-adjacent z-orig span {
    text-decoration: none !important;
    border: none !important;
  }
  z-tag.mwe-adjacent z-tran {
    background-color: var(--mwe-adjacent-bg) !important;
  }

  /* --- MWE Hover Hint: Subtle indicator for untranslated MWEs (only when showMweHints enabled) --- */
  &[data-show-mwe-hints="true"] z-tag.mwe-hover-hint {
    text-decoration: underline dotted;
    text-decoration-thickness: 2px;
    text-decoration-color: var(--mwe-adjacent-color);
    text-underline-offset: 3px;
  }
  &[data-show-mwe-hints="true"] z-tag.mwe-hover-hint[class*="mwe-color-"] {
    text-decoration-color: var(--mwe-color);
  }
  /* Mobile fallback: subtle background (text-decoration doesn't render on inline-block in mobile browsers) */
  @media (max-width: 768px) {
    &[data-show-mwe-hints="true"] z-tag.mwe-hover-hint {
      text-decoration: none;
      background-color: rgba(200, 140, 60, 0.12);
    }
  }

  /* --- MWE Translated: Permanent styling for translated MWE words --- */
  z-tag[class*="mwe-color-"]:not(.mwe-hover-hint) {
    color: var(--mwe-color) !important;
    font-weight: 600;
    background-color: var(--mwe-bg);
  }
  /* Underline on z-tag when no translation visible (only when showMweHints is enabled) */
  &[data-show-mwe-hints="true"] z-tag[class*="mwe-color-"]:not(.mwe-hover-hint):not(:has(z-orig)) {
    text-decoration: underline dotted var(--mwe-color);
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  /* Underline on z-orig when translation is visible */
  z-tag[class*="mwe-color-"]:not(.mwe-hover-hint) z-orig {
    color: var(--mwe-color) !important;
    font-weight: 600;
    text-decoration: underline dotted var(--mwe-color);
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  z-tag[class*="mwe-color-"]:not(.mwe-hover-hint) z-orig span {
    text-decoration: none !important;
    border: none !important;
  }
  z-tag[class*="mwe-color-"]:not(.mwe-hover-hint) z-tran {
    background-color: var(--mwe-tran-bg) !important;
  }

  /* --- MWE Hover Active: Solid underline when hovering MWE partner words --- */
  /* Adjacent MWEs use darker orange, separated MWEs use their assigned color */
  /* Words WITHOUT translation (no z-orig) */
  z-tag.mwe-hover-active:not(:has(z-orig)) {
    text-decoration-line: underline !important;
    text-decoration-style: solid !important;
    text-decoration-thickness: 3px !important;
    text-decoration-color: var(--mwe-color, var(--mwe-adjacent-color)) !important;
  }
  /* Words WITH translation (has z-orig) */
  z-tag.mwe-hover-active:has(z-orig) {
    text-decoration: none !important;
  }
  z-tag.mwe-hover-active z-orig,
  z-tag.mwe-hover-active z-orig span {
    text-decoration-line: underline !important;
    text-decoration-style: solid !important;
    text-decoration-thickness: 3px !important;
    text-decoration-color: var(--mwe-color, var(--mwe-adjacent-color)) !important;
    border: none !important;
  }

  /* ========================================================================
   * SOLUTION EXPRESSION HOVER (for exercises with multi-word bookmarks)
   * Highlights all words in the solution when hovering any of them
   * Uses same styling as regular word hover
   * ======================================================================== */
  z-tag.solution-hover-active {
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-decoration-color: rgb(255, 229, 158);
  }

  /* ========================================================================
   * REGULAR WORD HOVER (non-MWE)
   * ======================================================================== */
  z-tag:hover {
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-decoration-color: rgb(255, 229, 158);
  }
  /* Don't underline translation box - only underline z-orig */
  z-tag:hover:has(z-orig) {
    text-decoration: none;
  }
  z-tag:hover z-orig {
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-decoration-color: rgb(255, 229, 158);
  }
  /* MWE words use their color on hover */
  z-tag[class*="mwe-color-"]:hover {
    text-decoration-color: var(--mwe-color) !important;
  }
  z-tag[class*="mwe-color-"]:hover z-orig {
    text-decoration-color: var(--mwe-color) !important;
  }

  /* ========================================================================
   * TRANSLATION BOX STYLES
   * ======================================================================== */
  z-tran {
    margin-right: 0px !important;
    margin-left: 2px !important;
  }

  z-tag z-tran {
    margin-right: -0.2rem;
    margin-left: -0.2rem;
    margin-bottom: -0.3rem;
    margin-top: 0.1rem;
    padding-left: 0.3rem;
    border-radius: 0.3em;
    background-clip: padding-box;
    background-color: rgb(255 229 158 / 100%);
    font-size: 14px;
    line-height: 1.1rem;
    max-width: 100%;
    font-weight: 600;
    color: ${almostBlack};
    text-transform: lowercase;
    text-align: left;
    display: flex;
  }

  z-orig span {
    border-bottom: 1px dashed ${zeeguuOrange};
    border-radius: 0.35rem;
  }

  z-tag z-orig {
    width: 100%;
    color: ${zeeguuOrange};
    font-weight: 600;
  }

  .translationContainer {
    display: flex;
    width: 100%;
    align-items: center;
    margin-right: 2px;

    .arrow {
      margin-left: 0.1rem;
      padding-top: 0.1rem;
      padding-right: 0.2rem;
      filter: opacity(50%);
      :hover {
        filter: brightness(1.5);
        filter: opacity(100%);
      }
    }

    .translation-icon {
      font-size: 17px;
    }

    .unlink {
      margin: 0px 0.1rem;
      margin-left: auto;
      padding: 0.2rem 0.3rem;
      padding-left: -0.3rem;
    }

    .low-oppacity {
      filter: opacity(20%);
      :hover {
        filter: brightness(1.5);
        filter: opacity(100%);
      }
    }

    .hide {
      margin: 0px 0.1rem;
      margin-left: -4px;
      padding: 0.2rem 0.3rem;
    }
  }

  /* ========================================================================
   * ALTERNATIVE SELECTION STYLES
   * ======================================================================== */
  .handSelected,
  .handContributed {
    width: 1.5em;
    text-align: center;
  }

  .handSelected:after,
  .handContributed:after {
    display: none;
    opacity: 0.1;
    transition:
      visibility 0s 2s,
      opacity 2s linear;
  }

  .handSelected:after {
    content: " ";
    color: white;
  }
  .handContributed:after {
    content: " ";
    color: white;
  }

  .selectedAlternative,
  .contributedAlternativeTran {
  }

  .selectedAlternativeOrig,
  .contributedAlternativeOrig {
  }

  /* ========================================================================
   * TEXT PARAGRAPH FORMATTING
   * ======================================================================== */
  .textParagraph {
    &.h1 {
      font-size: 2em;
      font-weight: bold;
      margin: 1em 0 0.5em 0;
      line-height: 1.2;
    }
    &.h2 {
      font-size: 1.5em;
      font-weight: bold;
      margin: 0.8em 0 0.4em 0;
      line-height: 1.3;
    }
    &.h3 {
      font-size: 1.3em;
      font-weight: bold;
      margin: 0.7em 0 0.3em 0;
      line-height: 1.3;
    }
    &.h4 {
      font-size: 1.1em;
      font-weight: bold;
      margin: 0.6em 0 0.2em 0;
      line-height: 1.4;
    }
    &.h5 {
      font-size: 1em;
      font-weight: bold;
      margin: 0.5em 0 0.2em 0;
      line-height: 1.4;
    }
    &.h6 {
      font-size: 0.9em;
      font-weight: bold;
      margin: 0.5em 0 0.2em 0;
      line-height: 1.4;
      color: #666;
    }
    &.p {
      margin: 1em 0;
      line-height: 1.6;
    }

    /* List styling */
    &.ul {
      margin: 1em 0;
      padding-left: 0;
      list-style: none;
    }
    &.ol {
      margin: 1em 0;
      padding-left: 0;
      list-style: none;
      counter-reset: list-counter;
    }
    &.li {
      margin: 0.5em 0 0.5em 1.5em;
      line-height: 1.5;
      position: relative;
    }

    /* Blockquote styling */
    &.blockquote {
      margin-top: 1.5em;
      margin-bottom: 0;
      padding: 1em 1.5em;
      border-left: 4px solid ${zeeguuOrange};
      background-color: #f9f9f9;
      font-style: italic;
      position: relative;
    }

    &.blockquote::before {
      content: '"';
      font-size: 3em;
      color: ${zeeguuOrange};
      position: absolute;
      left: 0.2em;
      top: -0.1em;
      opacity: 0.3;
    }

    strong,
    b {
      font-weight: bold;
      color: ${almostBlack};
    }
    em,
    i {
      font-style: italic;
    }

    &.h1 + .textParagraph,
    &.h2 + .textParagraph,
    &.h3 + .textParagraph {
      margin-top: 0.5em;
    }
  }
`;

/* ========================================================================
 * CLOZE EXERCISE STYLES
 * ======================================================================== */

const pulseUnderline = keyframes`
  0%, 100% { border-bottom-color: #333; }
  50% { border-bottom-color: #666; }
`;

const correctAnswerAnimation = keyframes`
  0% { color: inherit; font-weight: normal; }
  100% { color: ${orange600}; font-weight: 700; }
`;

const ClozeWrapper = styled.span`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25em;
  margin-right: 0.25em;
  cursor: ${props => props.$isOver ? 'default' : 'text'};
`;

const ClozeInputWrapper = styled.span`
  position: relative;
`;

const ClozeHint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7em;
  color: #999;
  opacity: 0.8;
  pointer-events: none;
  white-space: nowrap;
`;

const ClozeInput = styled.input`
  border: none;
  border-bottom: 2px dotted ${props => props.$isOver ? orange600 : '#333'};
  background: transparent;
  outline: none;
  font-size: inherit;
  font-family: inherit;
  text-align: ${props => props.$isOver ? 'center' : 'left'};
  width: ${props => props.$width}em;
  max-width: ${props => props.$width}em;
  min-width: ${props => props.$isOver ? '2em' : '4em'};
  padding: 2px 4px;
  margin: 0;
  color: ${props => props.$isOver ? orange600 : 'inherit'};
  font-weight: ${props => props.$isOver ? '700' : 'normal'};
  cursor: ${props => props.$isOver ? 'default' : 'text'};
  animation: ${props => {
    if (props.$isCorrect) return `${correctAnswerAnimation} 0.6s ease-out forwards`;
    if (props.$isEmpty) return `${pulseUnderline} 2s ease-in-out infinite`;
    return 'none';
  }};
`;

const ClozeStaticPlaceholder = styled.span`
  border-bottom: 1px solid ${props => props.$isOver ? orange600 : '#333'};
  display: inline-block;
  min-width: 4em;
  color: ${props => props.$isOver ? orange600 : 'inherit'};
  font-weight: ${props => props.$isOver ? '700' : 'normal'};
  text-align: center;
`;

export {
  TranslatableText,
  ClozeWrapper,
  ClozeInputWrapper,
  ClozeHint,
  ClozeInput,
  ClozeStaticPlaceholder,
};
