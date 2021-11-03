import styled from "styled-components";
import { darkBlue, darkGrey, lightBlue } from "../../components/colors";

export const StyledPractisedWordsList = styled.div`
  .practised-words-container {
    border-left: solid 3px ${darkBlue};
    margin-bottom: 38px;
    min-width: 350px;
    user-select: none;
  }

  .translation-of-practised-word {
    color: ${lightBlue};
    margin-bottom: -15px;
    margin-top: 0px;
    margin-left: 1em;
  }

  .word-practised {
    margin-left: 1em;
    margin-bottom: -5px;
  }

  .practised-word-date-and-icons {
    display: flex;
    flex-direction: row;
    margin-left: 1em;
    font-size: small;
    margin-bottom: -25px;
  }

  .word-practised-date {
    color: ${darkGrey};
  }
`;
