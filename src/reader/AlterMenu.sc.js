import styled from "styled-components";

import {
  almostBlack,
  zeeguuDarkRed,
  zeeguuLightYellow,
  zeeguuVeryLightYellow,
} from "../components/colors";

const AlterMenuSC = styled.div`
  font-size: medium;
  z-index: 1000;
  text-align: left;

  position: absolute;
  max-width: 30em;
  background-color: ${zeeguuVeryLightYellow};
  border-radius: 0.5em;
  margin-top: 0.5em;
  padding: 0.3em;
  filter: drop-shadow(0 0 0.2rem rgb(0 0 0 / 50%));

  .additionalTrans {
    height: 100%;
    text-transform: lowercase;
    white-space: normal;
    border-bottom: 1px solid ${zeeguuLightYellow} !important;
    color: ${almostBlack};
    line-height: 1em;
    cursor: pointer;
    margin-top: 0.2em;
    font-weight: 500;

    &:hover {
      filter: brightness(90%);
    }
  }

  .selected {
    font-weight: 600;
  }

  .ownTranslationInput {
    all: unset;
    border: 0.17em solid ${zeeguuLightYellow};
    padding: 0.125em;
    padding-left: 0.5em;
    padding-right: 5px;
    height: 2em;
    width: 100%;
    box-sizing: border-box;
    background: white;
    color: ${almostBlack};
    border-radius: 0.4em;
    font-weight: 400;
    font-size: small;

    &:hover {
      filter: brightness(98%);
    }

    &:focus {
      border: 0.17em solid ${almostBlack};
      font-weight: 500;
    }
  }

  .alterMenuLink {
    //text-decoration: underline;
    margin-top: 0.2em;
    border-top: 1px solid ${zeeguuLightYellow} !important;
    color: orange;
    &:hover {
      filter: brightness(110%);
    }
  }

  .removeLink {
    //text-decoration: underline;
    margin-top: 0.2rem;
    padding-top: 0.2rem;
    margin-bottom: -0.2rem;
    border-top: 1px solid ${zeeguuDarkRed} !important;
    color: ${zeeguuDarkRed};
    font-size: small;

    &:hover {
      filter: brightness(110%);
    }
  }
`;

export { AlterMenuSC };
