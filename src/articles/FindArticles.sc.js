import styled from "styled-components";

const MaterialSelection = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sort = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Search = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export { MaterialSelection, Sort, Search };
