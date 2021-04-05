import styled from "styled-components";

const NarrowColumn = styled.div`
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 200px;
`;

let CenteredContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export { NarrowColumn, CenteredContent };
