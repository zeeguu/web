import styled, { css } from "styled-components";
import { darkBlue, lightOrange } from "../components/colors";

export const StudentActivityBar = styled.div`
 
  .activity-bar {
    height: 20px;
    display: flex;
    color: black;
    justify-content: center; 
    margin-top:0.5em;
  }
  .activity-bar#reading {
    border-radius: ${(props) => props.readingCorners};
    background-color: ${darkBlue};
  }
  .activity-bar#exercises {
    border-radius: ${(props) => props.exerciseCorners};
    background-color: ${lightOrange};
  }

  ${(props) =>
    props.isFirst &&
    css`
      .activity-bar {
        margin-top: 1.4em;
      }
    `}
`;
