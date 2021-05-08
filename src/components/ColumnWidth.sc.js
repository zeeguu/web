import styled from "styled-components";

const NarrowColumn = styled.div`
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 200px;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ContentOnRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5em;
  align-items: center;
`;

const WideColumn = styled.div`
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 200px;
`;

const WidestColumn = styled.div`
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 200px;
`;
export {
  NarrowColumn,
  CenteredContent,
  ContentOnRow,
  WideColumn,
  WidestColumn,
};
