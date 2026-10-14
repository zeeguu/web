import styled from "styled-components";

// One block: the way back and the page's rare actions on the top row, then the
// name of the thing being looked at (a class, a student), what it is, and its
// tabs, centred under one another. A page with tabs gets a line under them,
// closing the header off from the left-aligned content below; the active
// tab's underline sits on it.
export const DetailHeader = styled.header`
  margin: 2.5rem 0 1.5rem;
  text-align: center;

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.6rem;
    min-height: 2rem;
    margin-bottom: 1rem;
    text-align: left;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-left: auto;

    button {
      margin: 0;
      padding: 0.3rem 0.75rem;
      font-size: 0.8rem;
    }
  }

  /* Tabs right under the title, their underline sitting on the header's line. */
  .in-flow {
    padding: 0.9rem 0 0;
    border-bottom: 1px solid var(--border-light);
    background: none;
  }
`;
