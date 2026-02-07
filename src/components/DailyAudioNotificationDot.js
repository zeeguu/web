import styled, { keyframes, css } from "styled-components";
import { orange500 } from "./colors";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: -0.5rem;
  flex-shrink: 0;

  ${({ $status, $isActive }) => {
    switch ($status) {
      case "generating":
        return css`
          border: 2px solid transparent;
          border-top-color: ${$isActive ? orange500 : "white"};
          background-color: transparent;
          animation: ${spin} 1.5s linear infinite;
        `;
      case "ready":
      case "in_progress":
      default:
        // White on orange sidebar, orange when selected (white bg)
        return css`background-color: ${$isActive ? orange500 : "white"};`;
    }
  }}
`;

export default function DailyAudioNotificationDot({ status, isActive }) {
  // Only show for generating (spinner) or ready (new lesson waiting)
  if (!status || status === "completed" || status === "available" || status === "in_progress") return null;

  return <Dot $status={status} $isActive={isActive} />;
}
