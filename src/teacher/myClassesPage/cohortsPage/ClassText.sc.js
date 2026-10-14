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

// The text itself, as the heatmap: the reader's measure and line height, so
// it looks like the text the students read.
export const HeatText = styled.div`
  font-size: 1.05rem;
  line-height: 1.9;
  margin-bottom: 2.5rem;

  h2 {
    font-size: 1.4rem;
    line-height: 1.4;
  }
`;

// A looked-up word: a button, since tapping it names the students. Reset to
// read as text with a coloured background.
export const HeatWord = styled.button`
  font: inherit;
  color: inherit;
  border: none;
  border-radius: 3px;
  padding: 0 0.1em;
  margin: 0;
  cursor: pointer;
`;

export const PickedWord = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 6px;
  background: var(--infobox-bg);
  font-size: 0.85rem;
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);

  .scale {
    width: 5rem;
    height: 0.6rem;
    border-radius: 3px;
  }
`;
