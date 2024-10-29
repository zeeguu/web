import styled from "styled-components";

import {
  almostBlack,
  zeeguuDarkOrange,
  zeeguuLightYellow,
  zeeguuOrange,
  zeeguuVeryLightYellow,
} from "../components/colors";

const AlterMenuSC = styled.div`
  font-size: medium;
  z-index: 1000;

  position: absolute;
  max-width: 30em;
  background-color: ${zeeguuVeryLightYellow};
  border: 0.15em solid ${zeeguuDarkOrange};
  border-radius: 0.5em;
  margin-top: 0.5em;
  padding: 0.3em;

  .additionalTrans {
    height: 100%;
    text-transform: lowercase;
    white-space: normal;
    border-bottom: 1px solid ${zeeguuLightYellow} !important;
    color: ${almostBlack};
    line-height: 1em;
    cursor: pointer;
    margin-top: 0.2em;
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
  }
`;

export { AlterMenuSC };
