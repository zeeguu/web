import styled from "styled-components";
import { NarrowColumn } from "../components/ColumnWidth.sc";

// Extends NarrowColumn (keeps the desktop auto-centering) and only adds
// the 16px side margins on mobile — same pattern as TranslateNarrowColumn.
const ActivityNarrowColumn = styled(NarrowColumn)`
  @media (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

export { ActivityNarrowColumn };
