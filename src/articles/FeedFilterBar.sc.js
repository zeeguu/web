import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";
import { FilterRow as SharedFilterRow } from "../components/FilterRow.sc";

// The shared filter row with the feed's own spacing. Scrolling is the shared
// default, so only the padding is local.
export const FilterRow = styled(SharedFilterRow)`
  padding: 0.5rem 1rem 0.25rem;
`;

// Circular icon button sized to match the pills — used for the gear (opens
// Feed Preferences) and the clear-× (resets the selection back to all).
export const RoundButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1.5px solid var(--border-color);
  background: none;
  color: var(--text-primary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;

  @media (hover: hover) {
    &:hover {
      color: ${zeeguuOrange};
      border-color: ${zeeguuOrange};
    }
  }
`;
