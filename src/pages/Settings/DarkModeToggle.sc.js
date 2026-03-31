import styled from "styled-components";
import { orange500 } from "../../components/colors";

const ToggleRow = styled.li`
  box-sizing: border-box;
  display: flex;
  list-style-type: none;
  border: 2px solid var(--border-color);
  height: 56px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 1rem;
  font-weight: 500;
`;

const SegmentedControl = styled.div`
  display: flex;
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 2px;
`;

const SegmentButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition:
    background 0.15s,
    color 0.15s;

  background: ${({ $active }) => ($active ? orange500 : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "var(--text-secondary)")};

  &:hover {
    background: ${({ $active }) => ($active ? orange500 : "var(--bg-secondary)")};
  }
`;

export { ToggleRow, SegmentedControl, SegmentButton };
