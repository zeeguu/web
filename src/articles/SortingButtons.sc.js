import styled, { css } from "styled-components";
import * as b from "../components/allButtons.sc";

const SortingButtons = styled.div`
  margin-bottom: 1em;
  margin-left: 1em;
  display: flex;
  justify-content: flex-end;

  ${(props) =>
    props.isOnTeacherSite &&
    css`
      @media (min-width: 768px) {
        padding-right: 18vw;
      }

      @media (min-width: 1024px) {
        padding-right: 15.5vw;
      }

      @media (min-width: 1150px) and (max-width: 1365px) {
        padding-right: 13.7vw;
      }

      @media (min-width: 1366px) and (max-width: 1439px) {
        padding-right: 13vw;
      }

      @media (min-width: 1440px) {
        padding-right: 12.2vw;
      }

      @media (min-width: 1500px) and (max-width: 1920px) {
        padding-right: 9.2vw;
      }

      @media (min-width: 2560px) and (max-width: 2879px) {
        padding-right: 6.8vw;
      }

      @media (min-width: 2880px) {
        padding-right: 6vw;
      }
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
