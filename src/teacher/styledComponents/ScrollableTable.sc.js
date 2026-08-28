import styled from "styled-components";

// The student overview is a five-column table that used to widen its whole page
// to fit -- which made the class header jump sideways between the Students and
// Texts tabs. It scrolls inside the column instead.
export const ScrollableTable = styled.div`
  width: 100%;
  overflow-x: auto;

  > * {
    min-width: 40rem;
  }
`;
