import styled from "styled-components";
import { darkGrey } from "../../components/colors";

export const StyledExerciseType = styled.div`
  .type-explanation {
    font-size: small;
    color: ${darkGrey};
    margin: 0 1.1em;
  }

  .feedback-container {
    display: flex;
    flex-direction: row;
  }

  .feedback-explanation {
    font-size: small;
    color: ${darkGrey};
    margin: 0 0 0 1.1em;
  }

  .feedback {
    font-size: small;
    font-weight: 500;
    color: black;
    margin: 0 3px;
  }
`;
