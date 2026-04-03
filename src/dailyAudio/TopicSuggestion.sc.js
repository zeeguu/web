import styled from "styled-components";
import { blue100, blue700, blue900, lightGrey } from "../components/colors";

export const SuggestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  max-width: 360px;
`;

export const PillRow = styled.div`
  display: flex;
  gap: 0.4rem;
`;

export const SelectablePill = styled.button`
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  border: 1.5px solid ${({ $selected }) => ($selected ? blue700 : lightGrey)};
  background: ${({ $selected }) => ($selected ? blue100 : "var(--bg-secondary)")};
  color: ${({ $selected }) => ($selected ? blue900 : "var(--text-primary)")};
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;

  &:active {
    transform: scale(0.96);
    transition: transform 80ms;
  }
`;

export const DescriptionText = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
  margin-top: 0.3em;
  text-align: center;
  max-width: 500px;
  height: 4.5em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
`;


