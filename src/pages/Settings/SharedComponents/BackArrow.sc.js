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
  padding: 0;
  margin: 0;
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
