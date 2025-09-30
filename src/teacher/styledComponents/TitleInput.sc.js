import styled from "styled-components";
import { darkBlue } from "../../components/colors";
import "@reach/listbox/styles.css";

export const LabeledInputFields = styled.div`
  .input-container {
    margin-top: 1em;
  }

  input {
    margin-left: 0.7em;
  }
  
  textarea{
    margin-left: 0.7em;
  }

  .input-field:not([role="listbox"]) {
    border: solid 0.5px #e8e8e8 !important;
    border-radius: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  span#button--language_code {
    width: 95%;
    border: solid 0.5px #e8e8e8 !important;
    border-radius: 5px;
    margin: 1rem 0;
  }
`;
