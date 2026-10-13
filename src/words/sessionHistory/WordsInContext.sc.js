import styled from "styled-components";

export const WordsInContext = styled.ul`
  list-style: none;
  margin: 0.5em 0 0;
  padding: 0;
`;

export const WordInContext = styled.li`
  margin-bottom: 0.6em;

  .pair {
    font-weight: 600;
    color: var(--text-primary);
  }

  .sentence {
    font-size: 0.9em;
    color: var(--text-secondary);
  }
`;
