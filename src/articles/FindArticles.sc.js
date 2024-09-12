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
  justify-content: flex-end;
  margin-bottom: -3em;
`;

const SearchHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export { MaterialSelection, SortHolder, SearchHolder };
