import styled from "styled-components";

// One block: the name of the thing being looked at (a class, a student), the
// way back out, and the tabs under them. The row is a nested class rather than
// a second export — `Wrapper` around a single margin was not carrying its
// weight (and see CLAUDE.md on naming).
export const DetailHeader = styled.header`
  margin: 3.5rem 0 1.25rem;

  .title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 0.3rem;
  }

  /* Editing the class and adding a teacher moved here off the My Classrooms
     rows, where three outlined buttons per class made a wall of blue. */
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-left: auto;

    button {
      margin: 0;
      padding: 0.35rem 0.8rem;
      font-size: 0.8rem;
    }
  }
`;
