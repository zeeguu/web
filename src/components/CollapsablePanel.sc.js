import styled from "styled-components";

let ColapsableContainer = styled.div`
  display: flex;
  border-bottom: solid 1px;
  border-color: #757575;
  align-items: center;
  justify-content: space-between;
  padding: 0px 1em;
  padding-bottom: 0.5em;

  .arrow {
    font-size: xx-large;
    font-weight: 500;
  }
  :hover {
    cursor: pointer;
  }
`;

let ColapsableContents = styled.div``;

const Difficulty = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  gap: 0.5em;
  margin-right: 2em;
  img {
    height: 1.5em;
  }
  span {
    font-weight: 450;
  }
`;

export { ColapsableContainer, ColapsableContents };
