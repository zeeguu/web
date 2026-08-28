import styled, { css } from "styled-components";
import * as b from "../components/allButtons.sc";
import { almostBlack, veryLightGrey } from "../components/colors";

const SortingButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: medium;

  /* The select is the control now; SelectWrapper is width:100% by default, so
     hold it to the width of its longest label rather than the whole row. */
  > * {
    width: auto;
    min-width: 9rem;
  }

  ${(props) =>
    props.$isOnTeacherSite &&
    css`
      font-size: small;
    `}
`;

// Still extended by ArticleListBrowser's show-videos-only toggle.
const SortButton = styled(b.RoundButton)`
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: small;
  background-color: ${veryLightGrey};
  color: ${almostBlack} !important;

  @media (hover: hover) {
    &:hover {
      filter: brightness(0.98);
    }
  }
`;

export { SortingButtons, SortButton };
