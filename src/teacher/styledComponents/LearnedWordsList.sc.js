import styled from "styled-components";
import { darkBlue, lightBlue } from "../../components/colors";

export const StyledLearnedWordsList = styled.div`
  .no-learned-words-string {
    font-size: medium;
  }

  .learned-word-card {
    border-left: solid 3px ${darkBlue}; 
    min-width: 250px;
    min-height: 78px;
    user-select: none;
  }

  .learned-word {
    padding-top: 0.3em;
    margin-left: 0.9em;
    margin-bottom: 1px;
  }

  .learned-word-translation {
    color: ${lightBlue};
    margin-bottom: -10px;
    margin-top: 0px;
    margin-left: 1em;
  }
`;
