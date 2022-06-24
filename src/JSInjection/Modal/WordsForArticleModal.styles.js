import styled from "styled-components";
import colors from "../colors";

const ToolTipsContainer = styled.div`
display: flex;
flex-direction: column;

.tooltiptext {
  visibility: hidden;
  color: ${colors.darkGrayTooltip} !important;
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
  