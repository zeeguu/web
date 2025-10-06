import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  gap: 1rem;
  min-height: 100%;
  max-height: 100dvh;
`;

/* New: wraps the card + buttons as one unit */
export const CenterStack = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  width: 100%;
  height: 95%;
  min-height: 0;
  justify-items: center;
  align-content: end;

  > :first-child {
    min-height: 0;
    width: 100%;
    align-self: center;
  }

  > :last-child {
    align-self: end;
  }
`;

// ArticleSwipeBrowser.sc.ts
export const VisuallyHidden = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  pointer-events: none;
`;
