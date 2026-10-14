import styled from "styled-components";

export const Section = styled.section`
  margin-bottom: 2rem;
`;

const List = styled.ul`
  list-style: none;
  margin: 0.4rem 0 0;
  padding: 0;

  li {
    border-bottom: 1px solid var(--border-light);
  }
`;

// Word · translation · how many students, on one line; the sentence and the
// names open under it.
export const WordList = styled(List)`
  summary {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 0.55rem 0;
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }

  .word {
    font-weight: 600;
  }
  .translation {
    color: var(--text-secondary);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .count {
    margin-left: auto;
    flex-shrink: 0;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .more {
    padding: 0 0 0.7rem;
    font-size: 0.85rem;
  }
  .context {
    font-style: italic;
  }
  .who {
    margin-top: 0.3rem;
    color: var(--text-secondary);
  }
`;

export const ReaderList = styled(List)`
  a {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.2rem 0.8rem;
    padding: 0.55rem 0;
    color: var(--text-primary);
    font-weight: 400;
  }
  .name {
    font-weight: 600;
  }
  .details {
    margin-left: auto;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  @media (hover: hover) {
    a:hover {
      background: var(--hover-bg);
    }
  }
`;
