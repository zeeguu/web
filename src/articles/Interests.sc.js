import styled from "styled-components";
import { zeeguuSecondOrange, zeeguuThirdGray } from "../components/colors";

const Interests = styled.div`
  position: relative;
  margin-top: 15px;

  @media (min-width: 768px) {
    margin-top: 32px;
  }

  .filled-interest-btn {
    background-color: ${zeeguuSecondOrange};
    border: 1px solid ${zeeguuSecondOrange};
  }

  .unfilled-interest-btn {
    color: ${zeeguuThirdGray} !important;
    background-color: white;
    border: 1px solid ${zeeguuThirdGray};
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: scroll;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

export { Interests, ScrollContainer };
