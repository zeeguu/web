import styled from "styled-components";

import {
  almostBlack,
  zeeguuLightYellow,
  zeeguuVeryLightYellow,
} from "../components/colors";

const AlterMenuSC = styled.div`
  font-size: medium;

  position: absolute;
  max-width: 30em;
  background-color: ${zeeguuVeryLightYellow};
  border-radius: 0.3em;
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
  }

  .ownTranslationInput {
    color: ${almostBlack};
    font-weight: 400;
    font-size: small;
    background: ${zeeguuVeryLightYellow};
    background: green;
    border-bottom: 1px solid ${zeeguuLightYellow} !important;
  }

  .alterMenuLink {
    text-decoration: underline;
    color: orange;
  }
`;

export { AlterMenuSC };
