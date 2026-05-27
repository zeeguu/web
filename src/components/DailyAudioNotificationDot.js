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
  // Show the dot only when there's something actionable: a fresh unlistened
  // lesson waiting (ready) or one being generated (spinner). Everything else —
  // no lesson yet ("available", the backend default before generation),
  // already listened (completed), or mid-listen (in_progress) — shows nothing.
  // Listing the two positive cases (rather than excluding a few) keeps stray
  // backend statuses like "available" from leaking through the default branch.
  if (status !== AUDIO_STATUS.GENERATING && status !== AUDIO_STATUS.READY) return null;

  return <Dot $status={status} $isActive={isActive} $sidebar={sidebar} />;
}
