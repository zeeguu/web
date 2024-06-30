import styled from "styled-components";

const MaterialSelection = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SortAndSearch = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export { 
  MaterialSelection,
  SortAndSearch
  };
