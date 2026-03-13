import styled, { css } from "styled-components";
import { blue700 } from "../colors";

const StyledRadioGroup = styled.div`
  all: unset;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.5rem;
  padding: 0;
  max-height: 24rem;
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    max-height: none;
    overflow-y: visible;
  }
`;

const RadioGroupLabel = styled.div`
  margin: 0 0 1rem 0;
  display: block;
  width: 100%;
`;

const StyledInput = styled.input`
  appearance: none;
  position: absolute;
  opacity: 0;
`;

const OptionLabel = styled.label`
  cursor: pointer;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0 1.2rem;
  height: 2.75rem;
  border-radius: 2rem;
  border: solid 0.1rem var(--border-color);
  box-shadow: 0px 0.1rem var(--border-color);
  white-space: nowrap;
  transition: all 300ms ease-in-out;
  margin-bottom: 0.2rem;
  min-width: 11rem;

  ${({ $leftAligned }) =>
    $leftAligned &&
    css`
      justify-content: flex-start;
      padding: 0 0.75rem 0 0.5rem;
    `}

  &:hover {
    background-color: var(--hover-bg);
  }

  ${StyledInput}:checked + &:hover {
    background-color: var(--badge-bg);
  }

  ${StyledInput}:checked + & {
    background-color: var(--badge-bg);
    border-color: ${blue700};
    box-shadow: 0px 0.1rem ${blue700};
    color: var(--badge-text);
  }

  &:active,
  ${StyledInput}:checked + &:active {
    box-shadow: none;
    transform: translateY(0.1em);
    transition: all ease-in 0.08s;
  }
`;

export { StyledRadioGroup, RadioGroupLabel, StyledInput, OptionLabel };
