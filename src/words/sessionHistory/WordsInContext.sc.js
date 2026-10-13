import styled from "styled-components";

export const Excerpt = styled.p`
  margin: 0.6em 0 0;
  padding: 0.5em 0.8em;
  border-left: 3px solid var(--border-color);
  font-size: 0.9em;
  line-height: 1.5;
  color: var(--text-secondary);

  mark {
    background: none;
    font-weight: 700;
    color: var(--text-primary);
  }
`;
