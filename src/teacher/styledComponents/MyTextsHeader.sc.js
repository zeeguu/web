import styled from "styled-components";
import { darkBlue } from "../../components/colors";
import Tag from "../../pages/_pages_shared/Tag.sc";

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;

  /* The sort control sits at the far end; no spacer element needed. */
  > *:last-child {
    margin-left: auto;
  }
  padding-bottom: 0.8rem;
  margin-bottom: 0.2rem;
  border-bottom: 1px solid var(--border-color);
`;

// The app's filter pill (feed filter bar, feed preferences, onboarding) in its
// small variant. Only the accent changes: Tag's .selected is orange, and the
// teacher dashboard is blue. `$dashed` marks the "Not shared" pile, which is a
// filter over an absence rather than over a class.
export const Chip = styled(Tag).attrs({ className: "tiny" })`
  white-space: nowrap;
  border-style: ${({ $dashed }) => ($dashed ? "dashed" : "solid")};

  &,
  &.small {
    ${({ $on }) =>
      $on
        ? `border-color: ${darkBlue}; background-color: ${darkBlue}; color: white; font-weight: 600;`
        : `color: var(--text-secondary); font-weight: 500;`}
  }
`;

export const ChipCount = styled.span`
  margin-left: 0.3rem;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
`;
