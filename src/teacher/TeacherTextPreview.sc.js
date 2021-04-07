import styled from "styled-components";
import { darkBlue } from "../components/colors";

export const StyledTeacherTextPreview = styled.div`
  .lhs {
    display: flex;
    flex-direction: column;
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
  }
`;
