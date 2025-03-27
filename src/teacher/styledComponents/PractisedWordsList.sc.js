import styled from "styled-components";
import { darkBlue, darkGrey, lightBlue } from "../../components/colors";

export const StyledPractisedWordsList = styled.div`
  margin: 0 0.5rem;
  .table {
    width: 100%;
    margin-left: 0.5rem;
    text-align: left;
  }

  .table > * {
    display: table-row;
  }

  .table .col {
    display: table-cell;
  }
  .practised-words-container {
    border-left: solid 3px ${darkBlue};
    min-width: 340px;
    user-select: none;
    margin: 20px 0;
  }

  .word-practised {
    margin: 0 0 0 0.8rem;
  }

  .translation-of-practised-word {
    color: ${lightBlue};
    font-size: smaller;
    font-weight: 500;
    margin: 0 0 0.5rem 0.8rem;
  }

  .word-practised-date {
    color: ${darkGrey};
    min-width: 85px;
    font-size: small;
  }
`;
