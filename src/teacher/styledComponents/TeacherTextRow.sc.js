import styled from "styled-components";
import { darkBlue, lightBlue } from "../../components/colors";
import Tag from "../../pages/_pages_shared/Tag.sc";

export const Row = styled.article`
  display: flex;
  gap: 0.75rem;
  padding: 0.9rem 0.2rem;
  border-bottom: 1px solid var(--border-color);
`;

export const Flag = styled.div`
  flex: 0 0 auto;
  padding-top: 0.15rem;
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

export const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
`;

// Both are the app's pill (Tag) in its small variant. A class is state, not an
// action: filled, and only the trailing x is clickable -- so it renders as a
// span. The dashed one is the "share with another class" affordance.
export const Pill = styled(Tag).attrs({ as: "span", className: "tiny" })`
  padding-right: 0.2rem;
  border-color: ${darkBlue};
  background-color: ${darkBlue};
  color: white;
`;

export const PillRemove = styled.button`
  border: none;
  background: none;
  padding: 0 0.25rem;
  font-size: 0.85rem;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;

  @media (hover: hover) {
    &:hover {
      opacity: 1;
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const AddPill = styled(Tag).attrs({ className: "tiny" })`
  /* A bare "+" collapses to a circle too small to aim at on a phone. */
  min-width: 2rem;
  border-style: dashed;
  border-color: ${darkBlue};
  color: ${darkBlue};

  @media (hover: hover) {
    &:hover {
      background-color: ${lightBlue}33;
    }
  }
`;

export const NotShared = styled.span`
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-style: italic;
`;
