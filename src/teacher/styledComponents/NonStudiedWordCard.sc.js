import styled from "styled-components";
import { darkBlue, lightBlue, darkGrey, errorRed } from "../../components/colors";

export const StyledNonStudiesWordCard = styled.div`
  .non-studied-word-container {
    border-left: solid 3px ${darkBlue};
    min-width: 250px;
    min-height: 78px;
    user-select: none;
  }

  .non-studied-word {
    margin-bottom: 0;
    padding: 0.4em 2em 0.1em 1em;
  }

  .non-studied-word-translation {
    color: ${lightBlue};
    margin: 0 1.2em;
    font-size: smaller;
  }

  .red-reason {
    margin: 0.7em 0 0 1.2em;
    font-size: small;
    color: ${errorRed};
  }

  .grey-reason {
    margin: 0.7em 0 0 1.2em;
    font-size: small;
    color: ${darkGrey};
  }
`;
