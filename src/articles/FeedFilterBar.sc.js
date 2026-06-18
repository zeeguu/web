import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

// A single horizontally-scrolling row of filter pills (Spotify-style).
// Children don't shrink, so the row scrolls instead of squashing the pills.
export const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem 0.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome / Safari */
  }

  & > * {
    flex: 0 0 auto;
  }

  & button {
    white-space: nowrap;
  }
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
