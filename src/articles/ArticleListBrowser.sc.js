import styled from "styled-components";
import { SortButton } from "./SortingButtons.sc";

const MaterialSelection = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SortHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SearchHolder = styled.div`
  display: block;
`;

const ShowVideoOnlyButton = styled(SortButton)`
  &.selected {
    background-color: grey;
    color: white !important;
    font-weight: 600;
    &:hover {
      filter: brightness(1.02);
    }
  }
`;

// Level-change reload: the old cards stay in place, dimmed, under a pill that
// sticks to the viewport (the list is taller than the screen), and the new
// cards fade in when they arrive -- no blank page in between.
const FeedArea = styled.div`
  position: relative;
`;

const FeedCards = styled.div`
  transition: opacity 0.25s ease;
  opacity: ${(props) => (props.$dimmed ? 0.35 : 1)};
  pointer-events: ${(props) => (props.$dimmed ? "none" : "auto")};
`;

const LevelChangeOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
`;

const LevelChangePill = styled.div`
  position: sticky;
  top: 40vh;
  margin: 0 auto;
  width: fit-content;
  padding: 0.6em 1.2em;
  border-radius: 2em;
  background: var(--card-bg);
  color: var(--text-primary);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  font-weight: 600;
`;

export {
  MaterialSelection,
  SortHolder,
  SearchHolder,
  ShowVideoOnlyButton,
  FeedArea,
  FeedCards,
  LevelChangeOverlay,
  LevelChangePill,
};
