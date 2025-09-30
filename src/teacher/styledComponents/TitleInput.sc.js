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

  .input-field {
    border: solid 2px ${darkBlue};
    border-radius: 5;
    margin-top: 10;
    margin-bottom: 10;
  }

  span#button--language_code {
    width: 95%;
    border: none;
    margin: 4px 0 5px;
  }
`;
