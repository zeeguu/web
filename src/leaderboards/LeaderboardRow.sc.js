import { zeeguuOrange } from "../components/colors";
import styled from "styled-components";

export const StyledTableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  color: ${({ $isDark }) => ($isDark ? "#fff7e0" : "inherit")};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  & td {
    background: ${({ $highlight }) => ($highlight ? "rgba(255, 187, 84, 0.2)" : "none")};
  }

  &:hover td {
    background: ${({ $highlight }) => ($highlight ? "rgba(255, 187, 84, 0.3)" : "rgba(255, 187, 84, 0.15)")};
  }
`;

export const RankCell = styled.td`
  padding: 1em;
  text-align: center;
  font-weight: ${({ $rank, $emphasizeTopRanks }) => ($rank <= $emphasizeTopRanks ? 600 : 400)};
`;

export const UserDataCell = styled.td`
  padding: 0.5em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const SelfLabel = styled.span`
  font-size: 0.8em;
  font-weight: 600;
  padding: 0.2em 0.5em;
  border-radius: 6px;
  background: ${zeeguuOrange};
  color: white;
  margin-left: 0.25em;
`;

export const MetricCell = styled.td`
  padding: 0.5em;
  text-align: ${({ $textAlign }) => $textAlign ?? "center"};
  color: ${({ $color }) => $color ?? "inherit"};
`;
