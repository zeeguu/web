import styled from "styled-components";
import { darkBlue } from "../../components/colors";

/* The dialog itself scrolls at 85vh, which would push the filter box and the
   Close button out of reach for a teacher with a hundred classes. Scrolling
   only the list keeps both of them in place. */
export const CohortList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  max-height: 40vh;
  overflow-y: auto;
  padding: 0.25em;

  button {
    margin-right: 0;
  }
`;

export const NoMatches = styled.p`
  color: ${darkBlue};
  font-style: italic;
  margin: 1em 0.25em;
`;
