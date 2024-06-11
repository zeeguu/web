import { css } from "styled-components";
import {
  almostBlack,
  errorRed,
  zeeguuOrange,
  zeeguuTransparentLightOrange,
} from "./colors";

let formStyling = css`
  input,
  select {
    border: 1px solid ${zeeguuOrange};
    border-radius: 5px;
    color: ${almostBlack};
    margin-bottom: 1em;
    font-size: large;
    padding: 0.5em 0.5em;
    width: 90%;

    @media (min-width: 768px) {
      width: 80%;
      padding: 0.5em 0.5em;
      font-size: 0.8em;
    }
  }

  textarea {
    display: block;
    border: 1px solid ${zeeguuOrange};
    border-radius: 5px;
    color: ${almostBlack};
    margin-bottom: 1em;
    font-size: large;
    padding: 0.5em 0.5em;
    width: 90%;

    @media (min-width: 768px) {
      width: 80%;
      padding: 0.5em 0.5em;
      font-size: 0.8em;
    }
  }

  label {
    display: block;
    margin-bottom: 0.5em;

    @media (min-width: 768px) {
      font-size: 0.8em;
    }
  }

  p {
    @media (min-width: 768px) {
      font-size: 0.8em;
    }
  }

  input:focus {
    border: 2px solid ${zeeguuOrange};
    outline: none;
  }

  .error {
    background-color: ${zeeguuTransparentLightOrange};
    border: 1px solid ${zeeguuOrange};
    color: ${errorRed};
    border-radius: 5px;

    margin-bottom: 1em;
    padding: 0.4em;
  }
  .inputField {
    @media (min-width: 768px) {
      margin-left: 1em;
    }
  }
`;

export { formStyling };
