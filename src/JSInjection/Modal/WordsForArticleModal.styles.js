import styled from "styled-components";

const ToolTipsContainer = styled.div`
display: flex;
flex-direction: column;

.tooltiptext {
  visibility: hidden;
  color: rgb(153, 153, 153) !important;
  text-align: center;
  font-size:small !important;
  margin-left: 18px;
  margin-top: 3px;
  }

  :hover .tooltiptext {
    visibility: visible;
  }
`;

export {
    ToolTipsContainer,
  };
  