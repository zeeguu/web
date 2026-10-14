import styled from "styled-components";
import { streakFireOrange } from "../components/colors";

export const PickerSection = styled.div`
  margin-bottom: 1.5rem;

  .picker-label {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    text-align: center;
  }
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
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.2s,
    transform 0.15s;
  transform: ${({ $selected }) => ($selected ? "scale(1.1)" : "none")};
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 70%;
    height: 70%;
  }
`;

export const ColorOption = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  transition:
    border-color 0.2s,
    transform 0.15s;
  transform: ${({ $selected }) => ($selected ? "scale(1.2)" : "none")};
  position: relative;

  &:hover {
    transform: scale(1.2);
  }
`;

export const SelectionCheckmark = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${({ $mini }) => ($mini ? "0.6rem" : "1rem")};
  height: ${({ $mini }) => ($mini ? "0.6rem" : "1rem")};
  font-size: ${({ $mini }) => ($mini ? "0.5rem" : "0.8rem")};
  padding: 2px;
  border-radius: 50%;
  background: var(--streak-banner-border);
  stroke: ${streakFireOrange};
  stroke-width: 3;
  display: flex;
  justify-content: center;
  align-items: center;
`;
