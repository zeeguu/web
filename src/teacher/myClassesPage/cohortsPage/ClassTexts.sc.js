import styled from "styled-components";
import { darkBlue } from "../../../components/colors";

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.4rem;
`;

// A section's small caps heading on the one-text page (ClassText).
export const SectionLabel = styled.h2`
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0 0 0.2rem;
`;

// "Your students see only the texts below": a sentence, not a shouted label.
export const SectionNote = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 0.6rem;
`;

export const TextCard = styled.article`
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 1rem 1.2rem 1.1rem;
  margin-bottom: 0.8rem;

  button {
    margin-top: 0.9rem;
  }
`;

export const TextName = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.3;

  a {
    color: var(--text-primary);
  }
`;

// How much of the class has read the text, as a thin bar over the line that
// says it in words.
export const ReadShare = styled.div`
  height: 6px;
  margin-top: 0.9rem;
  border-radius: 3px;
  background: var(--border-light);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    background: ${darkBlue};
  }
`;

export const ReadingLine = styled.p`
  margin: 0.45rem 0 0;
  font-size: 0.9rem;
`;

export const TopWords = styled.p`
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);

  em {
    font-style: normal;
    color: var(--text-primary);
  }
`;
