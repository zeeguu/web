import styled from "styled-components";
import { darkBlue } from "../components/colors";
import "@reach/listbox/styles.css";

export const CohortFormInputFields = styled.div`
  .input-container {
    margin-top: 1em;
  }
  .input-field {
    border: solid 2px ${darkBlue};
    border-radius: 5;
    margin-top: 10;
    margin-bottom: 10;
  }

  span#button--language_id{
      width:95%;
      border:none;
      margin:4px 0 5px;
  }
  
`;
