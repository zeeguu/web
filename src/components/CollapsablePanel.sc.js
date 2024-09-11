import styled from "styled-components";

let CollapsableContainer = styled.div`
  display: flex;
  border-bottom: solid 1px;
  border-color: #757575;
  align-items: center;
  justify-content: space-between;
  padding: 0px 1em 0.5em;

  .arrow {
    font-size: xx-large;
    font-weight: 500;
  }
  :hover {
    cursor: pointer;
  }
`;

export { CollapsableContainer };
