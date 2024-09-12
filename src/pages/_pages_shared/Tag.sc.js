import styled from "styled-components";
import { lightGrey } from "../../components/colors";
import { almostBlack } from "../../components/colors";
import {
  zeeguuOrange,
  blue200,
  blue500,
  blue800,
} from "../../components/colors";

const Tag = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  line-height: 150%;
  font-weight: 600;
  margin: 0.5rem;
  border: 1.5px solid ${lightGrey};
  color: ${almostBlack};
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  background: none;
  cursor: pointer;

  &.outlined-orange {
    border: 1.5px solid ${zeeguuOrange};
  }

  &.small {
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    font-weight: 500;
    font-size: 0.9rem;
  }

  &.outlined-blue {
    align-items: center;
    border: 1.5px solid ${blue500};
    background-color: ${blue200};
    color: ${blue800};
  }

  &.selected {
    border: 1.5px solid ${zeeguuOrange};
    background-color: ${zeeguuOrange};
    color: white;
  }

  @media (max-width: 576px) {
    font-size: 0.9rem;
    margin: 0.4rem;
    padding: 0.75rem 1rem;
  }
`;

export { Tag };
