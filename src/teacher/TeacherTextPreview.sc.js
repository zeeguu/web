import styled from "styled-components";
import { darkBlue } from "../components/colors";

export const StyledTeacherTextPreview = styled.div`
  .lhs {
    display: flex;
    flex-direction: column;
    width: 500px;
    padding-right: 2vw;
  }

  .edit-btn {
    margin-top: 2vh;
  }

  .text-container {
    display: flex;
    padding: 1em;
    justify-content: space-between;
    margin-bottom: 2em;
    height: 6.5em;
    border-left: solid 3px ${darkBlue};
  }

  .action-container {
    display: flex;
    justify-content: space-between;
    margin-top: 1vh;
    margin-left: 5vh;
  }

  .added-to {
    color: ${darkBlue};
    border: solid 3px ${darkBlue};
  }
`;
