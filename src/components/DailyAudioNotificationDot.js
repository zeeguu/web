import styled, { keyframes, css } from "styled-components";
import { orange500 } from "./colors";

const pulse = keyframes`
  0% { background-color: ${orange500}; }
  50% { background-color: white; }
  100% { background-color: ${orange500}; }
`;

const lightGray = "#d0d0d0";

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: -0.5rem;
  flex-shrink: 0;

  ${({ $status, $isActive }) => {
    switch ($status) {
      case "available":
        return css`background-color: ${lightGray};`;
      case "generating":
        return css`animation: ${pulse} 1.5s ease-in-out infinite;`;
      case "ready":
      case "in_progress":
      default:
        // White on orange sidebar, orange when selected (white bg)
        return css`background-color: ${$isActive ? orange500 : "white"};`;
    }
  }}
`;

export default function DailyAudioNotificationDot({ status, isActive }) {
  if (!status || status === "completed") return null;

  return <Dot $status={status} $isActive={isActive} />;
}
