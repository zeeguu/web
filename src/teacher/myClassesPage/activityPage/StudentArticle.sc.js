import styled from "styled-components";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import * as s from "../../../reader/ArticleReader.sc";

// Above the text: whose translations these are, and how the student read it.
export const ReadingHeader = styled(FullWidthInfoMsg)`
  flex-direction: column;
  gap: 0.2rem;
  margin: 1rem 0 0.5rem;

  .details {
    font-weight: 400;
    font-size: 0.9em;
    color: var(--text-secondary);
  }
`;

// The reader, read-only: a word does nothing when clicked, so it should not
// look clickable either.
export const ReadOnlyReader = styled(s.ArticleReader)`
  && z-tag {
    cursor: default;
  }
`;
