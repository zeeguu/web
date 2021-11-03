import styled from "styled-components";
import { darkGrey } from "../../components/colors";

export const StyledExerciseType = styled.div`
  .type-explanation {
    font-size: small;
    color: ${darkGrey};
    margin: 1em 0 1em 1.1em;
  }

  .feedback-container {
    display: flex;
    flex-direction: row;
  }

  .feedback {
    font-size: small;
    font-weight: 500;
    color: black;
    margin-left:3px;
  }
`;