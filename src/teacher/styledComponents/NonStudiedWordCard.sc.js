import styled from "styled-components";
import { darkBlue, lightBlue, darkGrey } from "../../components/colors";

export const StyledNonStudiesWordCard = styled.div`
  .excluded-by-algorithm-string {
    margin: 0.5em 0 0 1.2em;
    font-size: small;
    color: red;
  }

  .not-yet-studied-string {
    margin: 0.5em 0 0 1.2em;
    font-size: small;
    color: ${darkGrey};
  }

  .non-studied-words-row {
    border-left: solid 3px ${darkBlue};
    margin-bottom: 38px;
    min-width: 270px;
    user-select: none;
  }

  .words-not-studied-translations {
    color: ${lightBlue};
    margin-bottom: -15px;
    margin-top: 0px;
    margin-left: 1em;
  }

  .words-not-studied {
    margin-left: 1em;
    margin-right: 1em;
    margin-bottom: -5px;
  }
`;
