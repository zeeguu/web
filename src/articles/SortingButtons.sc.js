import styled from "styled-components";
import * as b from "../components/allButtons.sc";

const SortingButtons = styled.div`
  margin-bottom: 1em;
  margin-left: 1em;
  /* background-color: lightgrey; //for testing */

  display: flex;
  justify-content: flex-end;

  .descending::after {
    content: "↑";
  }

  .ascending::after {
    content: "↓";
  }

  @media (min-width: 768px) {
    margin-bottom: 3em;
  }
`;

const SortButton = styled(b.RoundButton)`
  padding-left: 0.3em;
  padding-right: 0.3em;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  padding: 0.15em 0.35em;

  font-size: small;
  background-color: #efefef;
  color: #444444 !important;
`;

export { SortingButtons, SortButton };
