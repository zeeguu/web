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
  z-index: 1;

  ${({ $sidebar }) =>
    $sidebar
      ? css`
          position: relative;
          margin-left: -0.4rem;
          flex-shrink: 0;
        `
      : css`
          position: absolute;
          top: 0;
          left: calc(50% + 0.5rem);
        `}

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

export default function DailyAudioNotificationDot({ status, isActive, sidebar }) {
  // Only show for generating (spinner) or ready (new lesson waiting)
  if (!status || status === AUDIO_STATUS.COMPLETED || status === AUDIO_STATUS.IN_PROGRESS) return null;

  return <Dot $status={status} $isActive={isActive} $sidebar={sidebar} />;
}
