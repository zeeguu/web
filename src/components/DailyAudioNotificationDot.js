import styled, { keyframes, css } from "styled-components";
import { orange500 } from "./colors";
import { AUDIO_STATUS } from "../dailyAudio/AudioLessonConstants";

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
      case AUDIO_STATUS.GENERATING:
        return css`
          border: 2px solid transparent;
          border-top-color: ${$isActive ? orange500 : "white"};
          background-color: transparent;
          animation: ${spin} 1.5s linear infinite;
        `;
      case AUDIO_STATUS.READY:
      default:
        return css`background-color: ${$isActive ? orange500 : "white"};`;
    }
  }}
`;

export default function DailyAudioNotificationDot({ status, isActive }) {
  // Only show for generating (spinner) or ready (new lesson waiting)
  if (!status || status === AUDIO_STATUS.COMPLETED || status === AUDIO_STATUS.IN_PROGRESS) return null;

  return <Dot $status={status} $isActive={isActive} />;
}
