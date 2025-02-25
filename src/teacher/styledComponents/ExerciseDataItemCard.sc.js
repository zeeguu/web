import styled from "styled-components";
import { darkBlue } from "../../components/colors";

export const StyledExerciseDataItemCard = styled.div`
  .exercise-data-item-card-box {
    //text-align: center;
    height: 280;
    width: 290;

    margin-bottom: 2em;
    padding-top: 0.5em;
    text-align: center;
    border-radius: 15px;
  }

  .exercise-item-card-headline {
    font-size: medium;
  }

  .exercise-data-item-inner-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 90%;
    margin-left: 5%;
    min-height: 141px;
  }

  .view-more-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .view-more-btn-text {
    font-weight: 600;
    width: 4.5em;
    font-size: small;
  }

  .view-more-icon {
    margin-top: -0.5em;
    font-size: 45px;
    color: ${darkBlue};
  }

  .view-less-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .view-less-btn-text {
    font-weight: 600;
    width: 4.3em;
    font-size: small;
  }

  .view-less-icon {
    margin-top: -0.5em;
    font-size: 45px;
    color: ${darkBlue};
  }
`;
