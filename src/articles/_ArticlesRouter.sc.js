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

// The active tab's name and one sentence on what it holds, kept together
// (the sentence belongs to the title, not to the filter row below).
export const TabHeading = styled.header`
  text-align: center;
  margin: 2rem 0 1rem;

  h1 {
    font-weight: 300;
    margin: 0 0 0.25rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.4;
    margin: 0;
  }
`;
