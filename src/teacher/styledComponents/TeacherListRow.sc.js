import styled from "styled-components";

// One item in a teacher list -- a text on My Texts, a class on My Classrooms.
// Flat, separated by space: the classes used to be shadowed cards, which made
// the two pages look like different products.
export const Row = styled.article`
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem 0.6rem;
  margin: 0 -0.6rem;
  border-radius: 8px;

  /* The title is a link but the whole row reads as one object, so give it a
     hover. Wrapped, or an iOS tap leaves the row highlighted behind you. */
  @media (hover: hover) {
    &:hover {
      background-color: var(--bg-secondary);
    }
  }
`;

export const Flag = styled.div`
  flex: 0 0 auto;
  padding-top: 0.15rem;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;

  button {
    margin: 0;
    padding: 0.35rem 0.8rem;
    font-size: 0.8rem;
  }
`;

export const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const Title = styled.span`
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.3;
  color: var(--text-primary);
`;
