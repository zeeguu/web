import styled from "styled-components";
import { orange400, orange700, streakFireOrange } from "../components/colors";

export const TabBar = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.25rem;
  background: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: 0.75rem;
`;

export const TabButton = styled.button`
  min-width: 0;
  border: none;
  background: ${({ $active }) => ($active ? "var(--bg-primary)" : "transparent")};
  color: ${({ $active }) => ($active ? orange700 : "var(--text-secondary)")};
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 0.25rem;
  border-radius: 0.55rem;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: ${({ $active }) => ($active ? "0 1px 4px rgba(0, 0, 0, 0.08)" : "none")};
  transition:
    background 0.15s,
    color 0.15s;

  [data-theme="dark"] & {
    color: ${({ $active }) => ($active ? orange400 : "var(--text-secondary)")};
  }

  &:hover {
    color: ${({ $active }) => ($active ? orange700 : "var(--text-primary)")};

    [data-theme="dark"] & {
      color: ${({ $active }) => ($active ? orange400 : "var(--text-primary)")};
    }
  }

  @media (max-width: 480px) {
    font-size: 0.72rem;
    padding: 0.45rem 0.15rem;
  }
`;

export const PickerSection = styled.div`
  width: 100%;

  .picker-label {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.6rem;
    text-align: center;
  }
`;

export const PaletteSection = styled(PickerSection)`
  border-top: 1px solid var(--border-light);
  padding-top: 0.9rem;
`;

export const PickerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  justify-content: center;
`;

export const AvatarOption = styled.button`
  width: 5rem;
  height: 5rem;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 50%;
  border: none;
  box-shadow: ${({ $selected }) => ($selected ? `0 0 0 3px ${streakFireOrange}` : "none")};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
  transform: ${({ $selected }) => ($selected ? "scale(1.08)" : "none")};
  position: relative;

  &:hover {
    transform: scale(1.08);
  }
`;

export const PaletteOption = styled.button`
  width: 2.35rem;
  height: 2.35rem;
  background: ${({ $dualTone, $backgroundColor, $characterColor }) =>
    $dualTone
      ? `linear-gradient(90deg, ${$backgroundColor} 50%, ${$characterColor} 50%)`
      : $backgroundColor};
  border-radius: 50%;
  border: ${({ $selected }) => ($selected ? `3px solid ${streakFireOrange}` : "2px solid var(--border-light)")};
  cursor: pointer;
  padding: 0;
  transition:
    border-color 0.15s,
    transform 0.15s;
  transform: ${({ $selected }) => ($selected ? "scale(1.15)" : "none")};
  position: relative;

  &:hover {
    transform: scale(1.15);
  }
`;

export const SelectionCheckmark = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: ${({ $mini }) => ($mini ? "0.7rem" : "1.1rem")};
  height: ${({ $mini }) => ($mini ? "0.7rem" : "1.1rem")};
  font-size: ${({ $mini }) => ($mini ? "0.55rem" : "0.8rem")};
  padding: 2px;
  border-radius: 50%;
  background: var(--streak-banner-border);
  stroke: ${streakFireOrange};
  stroke-width: 3;
  display: flex;
  justify-content: center;
  align-items: center;
`;
