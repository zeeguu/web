import styled from "styled-components";

let CollapsableContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 1em 0.5em;
  margin-bottom: 0.3em;
  margin-top: 1em;

  .arrow {
    font-size: xx-large;
    font-weight: 500;
  }
  :hover {
    cursor: pointer;
  }
`;

export { CollapsableContainer };
