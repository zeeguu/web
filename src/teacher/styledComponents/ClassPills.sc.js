import styled from "styled-components";
import { darkBlue, lightBlue } from "../../components/colors";
import Tag from "../../pages/_pages_shared/Tag.sc";

// The classes a text is shared with. Used on My Texts, where the name filters
// the list, and in the text editor, where it links to the class.
export const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
`;

// The app's pill (Tag) in its small variant. The pill itself is state, not a
// control -- what can be clicked sits inside it: the name, and the trailing x.
export const Pill = styled(Tag).attrs({
  as: "span",
  className: "tiny outlined-blue",
})`
  cursor: default;
  padding-right: ${(props) => (props.$hasRemove ? "0.2rem" : "0.6rem")};
`;

// Rendered as a button (filters the list) or as a Link (opens the class), so
// it has to shed both the button chrome and the link underline.
export const PillLabel = styled.span`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
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

// The "share with another class" affordance: dashed, so it reads as an opening
// rather than as one more class.
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
