import styled from "styled-components";
import { darkBlue } from "../components/colors";

export const ViewMoreLessButton = styled.button`
  p {
    font-weight: 600;
  }
  .wrapper {
    width: 4.5em;
  }
  .viewLess {
    width: 4.3em;
  }
  .expansionIcon{
      margin-top: -.5em;
      font-size:45px;
      color: ${darkBlue}

  }
`;
