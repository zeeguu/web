import styled from "styled-components";

const CenteredColumn = styled.div`
  justify-content: center;
  display: flex;
  margin-top: 3em;
`;

const CenteredRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em; 
  margin: 0.5em 0.5em;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export { CenteredColumn, CenteredRow };
