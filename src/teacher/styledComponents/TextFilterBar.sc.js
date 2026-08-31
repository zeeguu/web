import styled from "styled-components";
import { darkBlue } from "../../components/colors";
import Tag from "../../pages/_pages_shared/Tag.sc";
import { FilterRow } from "../../components/FilterRow.sc";

// The same row as the feed's, wrapped rather than scrolling: a teacher on a
// desktop is better served seeing every class at once than scrolling to find one.
export const FilterBar = styled(FilterRow).attrs({ $wrap: true })`
  row-gap: 0.4rem;
  margin-bottom: 1.75rem;

  /* A trailing control (My Texts' sort) sits at the far end. Marked explicitly
     rather than by :last-child, which flung the last chip across the row on
     any bar that has only chips. */
  > .trailing {
    margin-left: auto;
  }
`;

// The app's filter pill (feed filter bar, feed preferences, onboarding) in its
// small variant. Only the accent changes: Tag's .selected is orange, and the
// teacher dashboard is blue. `$dashed` marks the "Not shared" pile, which is a
// filter over an absence rather than over a class.
export const Chip = styled(Tag).attrs({ className: "tiny" })`
  white-space: nowrap;
  border-style: ${({ $dashed }) => ($dashed ? "dashed" : "solid")};

`;

export const ChipCount = styled.span`
  margin-left: 0.3rem;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
`;
