import styled from "styled-components";
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";

export const StyledTooltip = styled(Tooltip)`
background-color: white !important;
border: none !important;
border-radius: 15px;
padding: 1em 2em !important;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08); 
`;
