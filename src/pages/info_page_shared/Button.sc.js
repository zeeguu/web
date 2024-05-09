import styled from "styled-components";
import { zeeguuDarkOrange, zeeguuOrange } from "../../components/colors";

const ButtonLink = styled.a`
  flex: 1;
  max-width: 65%;
  display: flex;
  justify-content: center;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  color: white;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.2rem;
  padding: 1em 2rem;
  border-radius: 4em;
  background-color: ${zeeguuOrange};
  background-color: ${zeeguuOrange};
  font-weight: 600;
  border-bottom: solid 0.2em ${zeeguuDarkOrange};

  &:active {
    border: none;
    margin: 0.2em 0 0 0;
  }

  &.small-square {
    border-radius: 0.3rem;
    padding: 1rem;
    border: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    width: 100%;
    padding: 0.75em 2rem;
  }
`;

export { Button, ButtonLink };
