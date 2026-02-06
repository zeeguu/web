import styled, { keyframes } from "styled-components";
import { orange500 } from "./colors";

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`;

const Dot = styled.div`
  position: absolute;
  top: 0;
  right: 0.25rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${orange500};
  border: 2px solid white;
  z-index: 1;

  &.generating {
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

export default function DailyAudioNotificationDot({ status }) {
  // Parent already filters out null/completed, but keep defensive check
  if (!status) return null;

  return <Dot className={status === "generating" ? "generating" : ""} />;
}
