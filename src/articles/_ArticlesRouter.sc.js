import styled from "styled-components";

export const IconSpan = styled.span`
  display: inline-flex;
  align-items: center;
  /* No horizontal padding: the row's gap handles spacing between icons, and
     dropping it lets the first icon sit flush with the row's left edge so it
     lines up with the gear/pills directly below. */
  padding: 0.4em 0;
  vertical-align: middle;
`;

export const ContentContainer = styled.div`
  min-height: 70vh;
`;
