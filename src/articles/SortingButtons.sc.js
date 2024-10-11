import styled, { css } from "styled-components";
import * as b from "../components/allButtons.sc";
import { almostBlack, veryLightGrey } from "../components/colors";

const SortingButtons = styled.div`
  margin-bottom: 1em;
  margin-left: 1em;
  display: flex;
  justify-content: flex-end;
  font-size: medium;

  .sort-by {
    padding-top: 0.3em;
  }

  ${(props) =>
    props.isOnTeacherSite &&
    css`
      margin-right: 13.7em;
    `}

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
  padding: 0.3rem 0.5rem;

  font-size: small;
  background-color: ${veryLightGrey};
  color: ${almostBlack} !important;

  ${(props) =>
    props.isOnTeacherSite &&
    css`
      margin-left: 2vw;
      font-size: medium;
    `}
`;

export { SortingButtons, SortButton };
