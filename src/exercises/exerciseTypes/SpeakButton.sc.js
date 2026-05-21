import styled, { keyframes } from "styled-components";
import { OrangeButton } from "./Exercise.sc.js";
import { blue900 } from "../../components/colors.js";

let SpeakerImage = styled.div`
  &.small {
    height: 20px;
    width: 20px;
  }

  &.large {
    height: 200px;
    width: 200px;
  }

  &.next {
    height: 75px;
    width: 75px;
  }
`;

// One-shot pop on mount to draw the eye to the speaker button as the
// primary affordance of an audio exercise. The headline no longer says
// "Click to have it repeated!" — the button has to speak for itself.
const speakerIntroPop = keyframes`
  0%   { transform: translateY(0)     scale(1);    }
  35%  { transform: translateY(-3px)  scale(1.06); }
  70%  { transform: translateY(0)     scale(0.98); }
  100% { transform: translateY(0)     scale(1);    }
`;

let SpeakButton = styled(OrangeButton)`
  height: fit-content;
  width: fit-content;
  outline: none;
  padding: 5px;
  background-color: var(--speak-button-bg);

  /* 3D / tactile treatment so the button reads as obviously pressable
     without needing the redundant "Click to have it repeated" instruction.
     - Hard bottom edge (no blur, vertical offset) = the chunky lip.
     - Softer cast shadow underneath = the lift off the surface.
     - Inset top highlight = subtle sculpted ridge. */
  box-shadow:
    0 4px 0 var(--speak-button-shadow, rgba(0, 0, 0, 0.18)),
    0 6px 14px rgba(0, 0, 0, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: transform 0.08s ease-out, box-shadow 0.08s ease-out;
  will-change: transform;

  /* Press feedback — the button visibly depresses. */
  &:active {
    transform: translateY(3px);
    box-shadow:
      0 1px 0 var(--speak-button-shadow, rgba(0, 0, 0, 0.18)),
      0 2px 4px rgba(0, 0, 0, 0.10),
      inset 0 1px 0 rgba(255, 255, 255, 0.20);
  }

  /* Hover lift on devices that genuinely hover. iOS treats unscoped :hover
     as "first tap previews, second tap activates" — wrapping in hover-media
     keeps touch a single-tap action. */
  @media (hover: hover) {
    &:hover {
      transform: translateY(-1px);
      box-shadow:
        0 5px 0 var(--speak-button-shadow, rgba(0, 0, 0, 0.18)),
        0 8px 18px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.40);
    }
  }

  /* Subtle one-shot pop on mount to invite the first tap. Suppressed if
     the user has Reduce Motion enabled. */
  @media (prefers-reduced-motion: no-preference) {
    animation: ${speakerIntroPop} 0.9s ease-out 1;
  }

  &:selected {
    background-color: ${blue900};
  }
  &:disabled {
    cursor: default;
    text-decoration: line-through;
  }
`;

export { SpeakButton, SpeakerImage };
