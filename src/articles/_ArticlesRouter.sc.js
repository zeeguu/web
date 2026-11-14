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

// The active tab's name and one sentence on what it holds. It labels the
// active icon, so it sits right under the tab row and stays smaller than the
// article titles below it: tab -> name (tight), name -> sentence (tight),
// then a clear gap before the filters and the list.
export const TabHeading = styled.header`
  text-align: center;
  margin: 0.25rem 0 1rem;

  h1 {
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0.15rem 0 0;
  }
`;
