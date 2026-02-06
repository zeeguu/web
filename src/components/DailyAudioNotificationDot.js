import styled, { keyframes, css } from "styled-components";
import { orange500, zeeguuWarmYellow } from "./colors";

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`;

const lightGray = "#b0b0b0";

const Dot = styled.div`
  position: absolute;
  top: 0;
  right: 0.25rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 1;

  ${({ $status }) => {
    switch ($status) {
      case "available":
        return css`background-color: ${lightGray};`;
      case "generating":
        return css`
          background-color: ${zeeguuWarmYellow};
          animation: ${pulse} 1.5s ease-in-out infinite;
        `;
      case "ready":
      case "in_progress":
      default:
        return css`background-color: ${orange500};`;
    }
  }}
`;

export default function DailyAudioNotificationDot({ status }) {
  if (!status || status === "completed") return null;

  return <Dot $status={status} />;
}
