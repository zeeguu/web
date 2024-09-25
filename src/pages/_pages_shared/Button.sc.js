import styled from "styled-components";
import {
  zeeguuDarkOrange,
  zeeguuOrange,
  zeeguuRed,
} from "../../components/colors";

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
  padding: 1rem 2.8rem;
  border-radius: 4em;
  background-color: ${zeeguuOrange};
  font-weight: 600;
  box-shadow: 0px 0.2rem ${zeeguuDarkOrange};
  transition: all ease-in 0.08s;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0.2em;

  &.small {
    padding: 0.7em 2em;
    font-size: 1rem;
  }

  &.warning {
    background-color: red;
    box-shadow: 0 0.2em ${zeeguuRed};
  }

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all ease-in 0.08s;
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

  &.small-border-btn {
    font-size: 1rem;
    padding: 0.4rem 1.4rem;
  }

  &.white-btn {
    color: ${zeeguuOrange};
    background-color: white;
    border: solid ${zeeguuOrange} 0.2em;
    box-shadow: 0px 0.2em ${zeeguuDarkOrange};
  }
`;

export { Button };
