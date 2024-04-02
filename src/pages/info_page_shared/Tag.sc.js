import styled from "styled-components";
import { lightGrey } from "../../components/colors";
import { almostBlack } from "../../components/colors";
import { zeeguuOrange } from "../../components/colors";

const Tag = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 1rem;
  line-height: 150%;
  font-weight: 600;
  margin: 0.5rem;
  border: 1px solid ${lightGrey};
  color: ${almostBlack};
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  background: none;
  cursor: pointer;

  &.active {
    border: 1px solid ${zeeguuOrange};
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
