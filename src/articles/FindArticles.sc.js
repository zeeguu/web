import styled from "styled-components";

const MaterialSelection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
`;

const ArticlesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 0;

  @media (min-width: 817px) {
    gap: 4%;
  }
`;

export { MaterialSelection, ArticlesContainer };
