import styled from "styled-components";

const NarrowColumn = styled.div`
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
`;

const CenteredContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .imgContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 1em;
    align-items: center;
  }
`;

const ToolTipsContainer = styled.div`
  display: flex;
  flex-direction: column;

  .tooltiptext {
    visibility: hidden;
    color: #999999 !important;
    text-align: center;
    margin-top: -2.4em;
    font-size: small;
  }

  :hover .tooltiptext {
    visibility: visible;
  }
`;

const ContentOnRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1em;
  button {
    margin: 0.2em;
  }
`;

const WideColumn = styled.div`
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
`;

const WidestColumn = styled.div`
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
`;
export {
  NarrowColumn,
  CenteredContentContainer,
  CenteredContent,
  ContentOnRow,
  WideColumn,
  WidestColumn,
  ToolTipsContainer,
};
