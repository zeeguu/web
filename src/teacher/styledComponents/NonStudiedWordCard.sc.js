import styled from "styled-components";

export const StyledNonStudiesWordCard = styled.div`
  .excluded-by-algorithm-string {
    margin: 0.5em 0 0 1.2em;
    font-size: small;
    color: red;
  }

  .not-yet-studied-string {
    margin: 0.5em 0 0 1.2em;
    font-size: small;
    color: #808080;
  }

  .non-studied-words-row {
    border-left: solid 3px #5492b3;
    margin-bottom: 38px;
    min-width: 270px;
    user-select: none;
  }

  .words-not-studied-translations {
    color: #44cdff;
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
