import styled from "styled-components";

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

export { MaterialSelection, SortHolder, SearchHolder };
