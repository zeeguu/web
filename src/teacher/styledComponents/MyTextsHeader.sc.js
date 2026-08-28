import styled from "styled-components";
import { darkBlue } from "../../components/colors";

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

export const Subtitle = styled.div`
  margin-top: 0.15rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  padding-bottom: 0.8rem;
  margin-bottom: 0.2rem;
  border-bottom: 1px solid var(--border-color);
`;

export const FilterSpacer = styled.div`
  flex: 1;
  min-width: 0.5rem;
`;

export const Chip = styled.button`
  font-family: inherit;
  font-size: 0.76rem;
  font-weight: ${({ $on }) => ($on ? 600 : 500)};
  white-space: nowrap;
  padding: 0.3rem 0.65rem;
  border-radius: 7px;
  cursor: pointer;
  border: 1px ${({ $dashed }) => ($dashed ? "dashed" : "solid")}
    ${({ $on }) => ($on ? darkBlue : "var(--border-color)")};
  background-color: ${({ $on }) => ($on ? darkBlue : "transparent")};
  color: ${({ $on }) => ($on ? "white" : "var(--text-secondary)")};
`;

export const ChipCount = styled.span`
  margin-left: 0.3rem;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
`;
