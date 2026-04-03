import styled from "styled-components";
import { blue100, blue700, blue900, lightGrey, orange500, orange600, orange800 } from "../components/colors";

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

export const TypePill = styled.button`
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

export const SuggestionInput = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  text-align: center;
  resize: none;
  min-height: 2.4rem;
  field-sizing: content;
`;

export const GenerateButton = styled.button`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${orange500};
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0px 0.3rem ${orange800};
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 30px;

  &:hover {
    background-color: ${orange600};
  }

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all 0.08s ease-in;
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

export const HintText = styled.p`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
`;
