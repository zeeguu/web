import styled from "styled-components";
import { white } from "../colors";

export const SaveAndEditButtonSC = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-family: Montserrat;
  font-weight: 500;
  background-color: var(--save-button-bg);
  color: ${white};
  border: none;
  border-radius: 1.0625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      background-color: var(--save-button-hover-bg);
    }
  }

  :root[data-theme="dark"] & {
    background-color: var(--save-button-bg);
  }
`;
