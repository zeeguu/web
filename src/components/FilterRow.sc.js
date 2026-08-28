import styled, { css } from "styled-components";

/**
 * A row of filter pills over a list.
 *
 * Default is the feed's behaviour: one line that scrolls sideways rather than
 * squashing or wrapping the pills, which is what keeps a long topic list usable
 * on a phone. `$wrap` is for the desktop dashboards, where seeing every filter
 * at once beats hiding some off the edge.
 */
export const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;

  & > * {
    flex: 0 0 auto;
  }

  & button {
    white-space: nowrap;
  }

  ${({ $wrap }) =>
    $wrap
      ? css`
          flex-wrap: wrap;
        `
      : css`
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */

          &::-webkit-scrollbar {
            display: none; /* Chrome / Safari */
          }
        `}
`;
