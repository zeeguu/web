import styled from "styled-components";

const MaterialSelection = styled.div`
  /* background-color: gainsboro; */
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;
export { MaterialSelection };
