import styled, { keyframes } from "styled-components";

import { almostBlack, zeeguuLightYellow, zeeguuVeryLightYellow } from "../components/colors";

const growIn = keyframes`
  from { grid-template-rows: 0fr; opacity: 0; }
  to { grid-template-rows: 1fr; opacity: 1; }
`;

const AlterMenuSC = styled.div`
  --altermenu-bg: ${zeeguuVeryLightYellow};
  --altermenu-text: ${almostBlack};
  --altermenu-border: ${zeeguuLightYellow};
  --altermenu-source-text: rgb(240, 204, 160);
  --altermenu-link-text: hsl(216, 100%, 48%);
  --altermenu-header-bg: ${zeeguuLightYellow};
  --altermenu-header-text: #01345d;
  --altermenu-header-text-disagreement: crimson;

  :root[data-theme="dark"] & {
    --altermenu-bg: rgb(50, 40, 30);
    --altermenu-text: rgb(255, 240, 220);
    --altermenu-border: rgb(90, 70, 40);
    --altermenu-source-text: rgb(160, 130, 90);
    --altermenu-link-text: hsl(216, 100%, 74%);
    --altermenu-header-bg: rgb(70, 55, 35);
    --altermenu-header-text: #ffcc66;
    --altermenu-header-text-disagreement: #ff7a7a;
  }

  font-size: 0.8em;
  font-weight: 500;
  z-index: 1000;
  text-align: left;

  position: absolute;
  min-width: 14em;
  max-width: 30em;
  background-color: var(--altermenu-bg);
  border-radius: 0.5em;
  margin-top: 0.5em;
  padding: 0.3em 0.8em 0.6em 0.8em;
  filter: drop-shadow(0 0 0.2rem rgb(0 0 0 / 50%));

  .additionalTrans {
    white-space: normal;
    color: var(--altermenu-text);
    line-height: 1em;
    cursor: pointer;
    margin-top: 0.4em;
    margin-left: 0.8em;

    &:hover {
      filter: brightness(90%);
    }
  }

  .selected {
    font-weight: 600;
  }

  .noAlternatives {
    color: gray;
    font-style: italic;
    margin: 0.3em 0.2em;
    font-size: small;
  }

  .alterMenuLink {
    //text-decoration: underline;
    margin-top: 0.2em;
    border-top: 1px solid var(--altermenu-border) !important;
    color: orange;
    &:hover {
      filter: brightness(110%);
    }
  }

  /* The actions' own gap never changes; the list carries the extra space
   * as padding, so it grows in with the list's animation. */
  .actionsSection {
    margin-top: 0.4em;
  }

  /* A one-row grid, so the row can animate from 0fr to its real height. */
  .alternativesList {
    display: grid;
    grid-template-rows: 1fr;
  }

  .alternativesRows {
    min-height: 0;
    overflow: hidden;

    /* Extra space before the actions, as content so it is clipped (and
     * grows in) with the rows rather than appearing at once. */
    &::after {
      content: "";
      display: block;
      height: 0.6em;
    }
  }

  /* Alternatives that arrive while the menu is open slide in, so the
   * actions below ease down instead of jumping from under the finger. */
  .alternativesList.growIn {
    animation: ${growIn} 300ms ease-out;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  .removeLink,
  .neutralLink {
    margin-top: 0.5em;
    cursor: pointer;
    color: var(--altermenu-text);
    opacity: 0.7;

    @media (hover: hover) {
      &:hover {
        filter: brightness(110%);
      }
    }
  }

  .altermenuSourceLabel {
    margin-top: 2px;
    font-size: 0.7em;
    color: var(--altermenu-source-text);
  }
`;

export { AlterMenuSC };
