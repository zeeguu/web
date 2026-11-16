import styled from "styled-components";

const BackArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-self: center;
  cursor: pointer;
  color: var(--text-secondary);
  background: none;
  border: none;
  /* The arrow is a 9x15 glyph: far too small to hit on a phone. Pad it out to
     a ~50px touch target and cancel the padding with a negative margin, so
     the arrow stays exactly where it was drawn. */
  padding: 1rem 1.25rem;
  margin: -1rem -1.25rem;
  -webkit-tap-highlight-color: transparent;
  @media (hover: hover) {
    &:hover {
      color: var(--text-secondary);
    }
  }
  &:active {
    color: var(--text-secondary);
  }
`;

// Where the arrow goes, said next to it: a breadcrumb rather than a bare "<".
const BackLabel = styled.span`
  margin-left: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export { BackArrow, BackLabel };
