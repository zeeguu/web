import styled from "styled-components";
import { zeeguuDarkOrange, zeeguuOrange } from "../../components/colors";

const Button = styled.button`
  cursor: pointer;
  color: white;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.2rem;
  padding: 1rem 2.75rem;
  border-radius: 4em;
  background-color: ${zeeguuOrange};
  font-weight: 600;
  border-bottom: solid 0.2em ${zeeguuDarkOrange};

  &:active {
    border: none;
    margin: 0.2em 0 0 0;
  }

  //span the full width of a parent
  &.full-width-btn {
    padding: 1rem;
    width: 100%;

    @media (max-width: 768px) {
      width: 100%;
      padding: 1rem 0.5rem;
      text-overflow: ellipsis;
      overflow-y: hidden;
    }
  }

  &.small-square-btn {
    border-radius: 0.3rem;
    padding: 1rem;
    border: none;
  }
`;

export { Button };
