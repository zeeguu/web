import styled, { css } from "styled-components";

const NarrowColumn = styled.div`
  max-width: 852px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;

  ${({ isOnCenter }) => {
    return (
      !!isOnCenter &&
      css`
        max-width: 852px;
        align-items: center;
        justify-content: space-between;
      `
    );
  }};
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  margin-top: 3em;
  button {
    margin: 0.2em;
  }
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
  ToolTipsContainer,
};
