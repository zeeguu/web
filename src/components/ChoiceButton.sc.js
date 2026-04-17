import styled, { keyframes } from "styled-components";
import { zeeguuOrange, zeeguuTransparentMediumOrange } from "./colors";

const tapBounce = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.08); }
  70%  { transform: scale(0.96); }
  100% { transform: scale(1); }
`;

// Outlined choice button with parametric accent color.
// Idle: accent border + accent text. .selected: filled with accent.
// .hovered: tinted at low alpha. Pass $color to override the default orange;
// $selectedTextColor defaults to #111 (dark on orange) — use #fff for lighter
// accents like green or red.
const ChoiceButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 5px;
  padding: 0.4em 1em;
  width: 8em;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--bg-primary);
  color: ${(p) => p.$color || zeeguuOrange};
  border: 1.5px solid ${(p) => p.$color || zeeguuOrange};
  border-radius: 0.5em;

  &.tap-bouncing {
    animation: ${tapBounce} 0.22s ease-out;
  }

  &.selected,
  &.selected:hover {
    background-color: ${(p) => p.$color || zeeguuOrange};
    border-color: ${(p) => p.$color || zeeguuOrange};
    color: ${(p) => p.$selectedTextColor || "#111"};
  }
  &.selected svg {
    color: ${(p) => p.$selectedTextColor || "#111"};
  }

  &.hovered {
    background-color: ${(p) => (p.$color ? `${p.$color}22` : zeeguuTransparentMediumOrange)};
    border-color: ${(p) => p.$color || zeeguuOrange};
    color: ${(p) => p.$color || zeeguuOrange};
  }
  &.hovered svg {
    color: ${(p) => p.$color || zeeguuOrange};
  }
`;

export { ChoiceButton, tapBounce };
