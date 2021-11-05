import styled from "styled-components";
import { darkBlue, darkGrey, lightBlue } from "../../components/colors";

export const StyledPractisedWordsList = styled.div`
  p {
    margin: 0;
  }

  .practised-words-container {
    border-left: solid 3px ${darkBlue};
    min-width: 340px;
    user-select: none;
    margin: 20px 0;
  }

  .word-practised {
    margin: 0 0 0 1em;
  }

  .translation-of-practised-word {
    color: ${lightBlue};
    font-size: smaller;
    margin: 0 0 1em 1.2em;
  }

  .practised-word-date-and-icons {
    display: flex;
    flex-direction: row;
    margin: 0 0 0 1.2em;
    font-size: small;
  }

  .word-practised-date {
    color: ${darkGrey};
    min-width: 85px;
  }
`;
