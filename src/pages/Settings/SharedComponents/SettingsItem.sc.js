import styled from "styled-components";
import { lightGrey } from "../../../components/colors";

const SettingsItem = styled.li`
  .settings-link {
    color: inherit;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 500;
  }

  box-sizing: border-box;
  display: flex;
  list-style-type: none;
  border: 2px solid var(--border-color);
  height: 56px;
  width: 100%;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: var(--hover-bg);
  }

  &:active {
    background-color: var(--active-bg);
  }
`;

// The item's name, after its icon when it has one. The icons are muted and the
// same size on every row, so they read as a column to scan down rather than
// as part of each label.
const ItemLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    font-size: 1.25rem;
    color: var(--text-muted);
  }
`;

export { SettingsItem, ItemLabel };
