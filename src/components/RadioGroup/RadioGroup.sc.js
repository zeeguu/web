import styled, { css } from "styled-components";
import { blue700 } from "../colors";

const StyledRadioGroup = styled.div`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-content: flex-start;
  gap: 0.5rem;
  padding: 0;

  ${({ $variant }) =>
    $variant === "card"
      ? css`
          /* Full-width rows stacked at any width — a settings list, not chips. */
          flex-direction: column;
          width: 100%;
        `
      : css`
          flex-direction: row;
          flex-wrap: wrap;
          overflow-y: scroll;
          overflow-x: hidden;
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
        `}
`;

const RadioGroupLabel = styled.div`
  margin: 0 0 1rem 0;
  display: block;
  width: 100%;
`;

const OptionRow = styled.div`
  ${({ $variant }) =>
    $variant === "card" &&
    css`
      width: 100%;
    `}
`;

const StyledInput = styled.input`
  appearance: none;
  position: absolute;
  opacity: 0;
`;

// The label IS the control: the native radio is hidden, so everything the user
// sees and taps is this element.
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

  /* Card variant: height comes from the content (label + wrapped description)
     instead of the chip's fixed 2.75rem, and the row fills its container. */
  ${({ $variant }) =>
    $variant === "card" &&
    css`
      width: 100%;
      min-width: 0;
      height: auto;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
      white-space: normal;
      border-radius: 0.75rem;
      padding: 0.85rem 1rem;
      font-weight: 500;
      margin-bottom: 0;
    `}

  /* Hover only where a real pointer exists: on iOS an unscoped :hover sticks
     after a tap, turning the first tap into a preview and needing a second one
     to actually select. */
  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-bg);
    }

    ${StyledInput}:checked + &:hover {
      background-color: var(--badge-bg);
    }
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

// Card variant only: label stacked over its description.
const CardText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

const CardLabel = styled.span`
  font-weight: 600;
`;

// Stays secondary-coloured even on the selected row: the description is
// supporting text, and the tint + border already carry the selected state.
const CardDescription = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--text-secondary);
`;

// A non-colour cue for the selected row, so selection does not rely on the
// tint and border alone. Rendered only when selected, hence currentColor —
// which is the selected row's --badge-text.
const CardCheck = styled.span`
  margin-left: auto;
  padding-left: 0.75rem;
  font-weight: 700;
  line-height: 1.4;
  color: currentColor;
`;

export {
  StyledRadioGroup,
  RadioGroupLabel,
  OptionRow,
  StyledInput,
  OptionLabel,
  CardText,
  CardLabel,
  CardDescription,
  CardCheck,
};
