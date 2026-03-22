import styled from "styled-components";

export const SearchBarContainer = styled.div`
  display: flex;
  gap: 0.5em;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1em;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5em 1em;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1em;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--link-color);
    box-shadow: 0 0 0 2px var(--light-badge-bg);
  }
`;

export const SearchButton = styled.button`
  padding: 0.5em 1em;
  border-radius: 4px;
  border: 1px solid var(--border-light);
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;

  &:hover {
    background: var(--hover-bg);
    border-color: var(--border-color);
  }

  &:active {
    background: var(--active-bg);
  }

  &:focus-visible {
    outline: 2px solid var(--link-color);
    outline-offset: 1px;
  }
`;
