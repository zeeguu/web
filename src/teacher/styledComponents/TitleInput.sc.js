import styled from "styled-components";
import { darkBlue } from "../../components/colors";
import "@reach/listbox/styles.css";

export const LabeledInputFields = styled.div`
  input {
    margin-left: 0.7em;
  }

  textarea {
    margin-left: 0.7em;
  }

  .input-field:not([role="listbox"]) {
    border: solid 0.3px #f0f0f0 !important;
    border-radius: 5px;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  span#button--language_code {
    border-radius: 5px;
    margin: 1rem 0;
  }
`;
