import styled from "styled-components";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
  margin: 1em 0;
  @media (max-width: 576px) {
    margin: 0.8em 0;
  }
`;

export default Main;
