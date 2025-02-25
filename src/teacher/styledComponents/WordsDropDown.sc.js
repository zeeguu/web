import styled from "styled-components";
import { darkBlue } from "../../components/colors";

export const StyledWordsDropDown = styled.div`
  .exercise-categories-drop-down {
    padding: 20px;
    box-shadow:
      0 4px 8px 0 rgba(0, 0, 0, 0.12),
      0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 15px;
    width: 90%;
    margin: auto;
  }

  .exercise-categories-drop-down-headline-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .exercise-drop-down-headlines {
    color: ${darkBlue};
  }

  .information-icon {
    color: ${darkBlue};
    font-size: 45px;
  }

  .exercise-drop-down-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;
