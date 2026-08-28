import styled from "styled-components";

// One block: the class's name, the way back out, and the tabs under them.
// The row is a nested class rather than a second export — `Wrapper` around a
// single margin was not carrying its weight (and see CLAUDE.md on naming).
export const ClassHeader = styled.header`
  margin-bottom: 1rem;

  .title-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.3rem;
  }
`;
