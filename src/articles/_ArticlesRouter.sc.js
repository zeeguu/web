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

// The active tab's name and one sentence on what it holds, in the light
// page-title style (PageTitle). Grouped by spacing: air under the tab row,
// the sentence close under the name it explains, then a larger gap before
// the filters and the list.
export const TabHeading = styled.header`
  text-align: center;
  margin: 1.25rem 0 1.5rem;

  h1 {
    font-weight: 300;
    line-height: 1.15;
    margin: 0;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.4;
    margin: 0.4rem 0 0;
  }
`;
