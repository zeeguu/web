import styled, { css } from "styled-components";
import { darkBlue } from "../components/colors";

export const ViewMoreLessButton = styled.div`
  p {
    font-weight: 600;
    font-family: "Montserrat";
  }
  .wrapper {
    width: 4.5em;
    margin-top: 2.5em;
  
  }
  .viewLess {
    width: 4.3em;
  }
  .expansionIcon{
      margin-top: -0.5em;
      font-size:45px;
      color: ${darkBlue}
  }

  ${(props) =>
    props.isFirst &&
    css`
    .wrapper {
      margin-top: 4em;
    }

    `}

`;
