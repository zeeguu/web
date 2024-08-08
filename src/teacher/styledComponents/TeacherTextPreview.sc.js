import styled from "styled-components";
import { darkBlue } from "../../components/colors";

export const StyledTeacherTextPreview = styled.div`
  .lhs {
    display: flex;
    flex-direction: column;
    width: 500px;
    margin-left: 1em;
  }

  .added-container {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  .classes-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.7em 0em;
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
    width: 90%;
  }

  .action-container {
    display: flex;
    justify-content: space-between;
    margin-top: 1vh;
    margin-left: 5vh;
    width: 300px;
  }

  .added-to {
    color: ${darkBlue};
    border-color: ${darkBlue} !important;
  }
`;
