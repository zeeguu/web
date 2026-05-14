import styled from "styled-components";

import { almostBlack, zeeguuDarkRed, zeeguuLightYellow, zeeguuVeryLightYellow } from "../components/colors";

const AlterMenuSC = styled.div`
  --altermenu-bg: ${zeeguuVeryLightYellow};
  --altermenu-text: ${almostBlack};
  --altermenu-border: ${zeeguuLightYellow};
  --altermenu-input-bg: white;
  --altermenu-input-focus-border: ${almostBlack};
  --altermenu-source-text: rgb(240, 204, 160);
  --altermenu-action-text: ${zeeguuDarkRed};
  --altermenu-action-border: ${zeeguuDarkRed};
  --altermenu-link-text: hsl(216, 100%, 48%);
  --altermenu-header-bg: ${zeeguuLightYellow};
  --altermenu-header-text: #01345d;
  --altermenu-header-text-disagreement: crimson;

  :root[data-theme="dark"] & {
    --altermenu-bg: rgb(50, 40, 30);
    --altermenu-text: rgb(255, 240, 220);
    --altermenu-border: rgb(90, 70, 40);
    --altermenu-input-bg: rgb(35, 28, 20);
    --altermenu-input-focus-border: rgb(255, 240, 220);
    --altermenu-source-text: rgb(160, 130, 90);
    --altermenu-action-text: #ff7a7a;
    --altermenu-action-border: rgb(120, 60, 60);
    --altermenu-link-text: hsl(216, 100%, 74%);
    --altermenu-header-bg: rgb(70, 55, 35);
    --altermenu-header-text: #ffcc66;
    --altermenu-header-text-disagreement: #ff7a7a;
  }

  font-size: medium;
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
    height: 100%;
    white-space: normal;
    color: var(--altermenu-text);
    line-height: 1em;
    cursor: pointer;
    margin-top: 0.4em;
    margin-left: 0.8em;
    font-weight: 600;

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

  .ownTranslationInput {
    all: unset;
    border: 0.17em solid var(--altermenu-border);
    padding: 0.125em;
    padding-left: 0.5em;
    padding-right: 5px;
    height: 2em;
    width: 100%;
    box-sizing: border-box;
    background: var(--altermenu-input-bg);
    color: var(--altermenu-text);
    border-radius: 0.4em;
    font-weight: 400;
    font-size: 16px;

    &:hover {
      filter: brightness(98%);
    }

    &:focus {
      border: 0.17em solid var(--altermenu-input-focus-border);
      font-weight: 500;
    }
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

  .actionsSection {
    margin-top: 0.8rem;
  }

  .removeLink,
  .addOwnLink {
    margin-top: 0.2rem;
    cursor: pointer;

    &:hover {
      filter: brightness(110%);
    }
  }

  .removeLink {
    color: var(--altermenu-action-text);
  }

  .addOwnLink {
    color: var(--altermenu-link-text);
  }

  .altermenuSourceLabel {
    margin-top: 2px;
    font-size: 0.7em;
    color: var(--altermenu-source-text);
  }
`;

export { AlterMenuSC };
