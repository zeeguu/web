import styled from "styled-components";
import { zeeguuWarmYellow } from "../../../components/colors";

const LevelWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: right;
  padding-right: 1em;
  @media (max-width: 800px) {
    margin-left: 0;
    width: 100%;
    margin-top: 0.5em;
    justify-content: flex-start;
    padding-right: 1em;
    margin-right: 2em;
    padding-left: 1em;
  }
`;

const WordProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  margin: 0.1em auto 0.5em auto;

  @media (max-width: 768px) {
    width: 60%;
    margin: 0.05em auto 0.25em auto;
  }
`;

const LevelIndicator = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard */

  .level-indicator {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 4px;
    align-items: center;
    margin: 0.5em 0;
    position: relative;
  }

  .progress-bar {
    position: relative;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-origin: border-box;
    overflow: hidden;
  }

  .progress-bar::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #c6c6c6;
    border-radius: 5px;
    z-index: 0;
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: ${({ isGreyedOutBar }) => (isGreyedOutBar ? "transparent" : "#74a664")};
    transition: width 1.5s ease-in-out;
    border-radius: 5px;
    z-index: 2;
  }

  .lost-section {
    position: absolute;
    top: 0;
    height: 100%;
    background: #f88431;
    transition:
      width 1s ease-in-out,
      left 1s ease-in-out;
    border-radius: 5px;
    z-index: 1;
  }

  .level-circles-wrapper {
    display: flex;
    gap: 4px;
    position: relative;
    width: 100%;
  }

  .level-circle {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 25px;
    height: 25px;
    font-size: 10px;
    color: white;
    background-color: var(--progress-circle-bg, #a1a1a1);
    border-radius: 50%;
    z-index: 2;
    transition:
      background-color 0.3s,
      border-color 0.3s;
  }

  .level-circle.filled {
    background-color: ${({ isGreyedOutBar }) => (isGreyedOutBar ? "#e0e0e0" : "#74a664")};
  }

  .level-circle.blink {
    animation: blink-animation 1s 3 alternate;

    @keyframes blink-animation {
      0% {
        background-color: #74a664;
      }
      100% {
        background-color: #f88431;
      }
    }
  }

  .level-circle.filled::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: #ffffff; /* Inner circle color */
    border-radius: 50%;
  }

  .level-circle.passed {
    background-color: #74a664;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .level-circle.final {
    width: 32px;
    height: 32px;
  }

  .level-circle.learned {
    background-color: #74a664;
  }

  .level-circle.upcoming {
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .level-indicator {
      margin: 0.25em 0;
      gap: 6px;
      padding: 2px;
    }
    .progress-bar {
      height: 9px;
    }

    .level-circle {
      width: 25px;
      height: 25px;
    }

    .level-circle.filled::before {
      width: 10px;
      height: 10px;
    }

    .level-circle.final {
      width: 32px;
      height: 32px;
    }

    .school-icon {
      font-size: 18px;
    }
  }
`;

export { LevelIndicator, LevelWrapper, WordProgressWrapper };
