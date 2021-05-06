import styled from "styled-components";

const NarrowColumn = styled.div`
  /* border: 1px solid lightgray; */
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

let ContentOnRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export { NarrowColumn, CenteredContent, ContentOnRow };
