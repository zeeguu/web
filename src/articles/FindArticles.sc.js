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
  margin-bottom: 3em;
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

export { MaterialSelection, SortHolder, SearchHolder, ShowVideoOnlyButton };
