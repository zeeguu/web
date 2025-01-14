import styled from "styled-components";
import { zeeguuWarmYellow } from "../../../components/colors";

const LevelIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard */

  .level-indicator {
    width: 70%;
    display: flex;
    align-items: center;
    margin: 1em 0;
    position: relative;
  }

  .progress-bar {
    position: relative;
    width: 100%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 10px;
    border: 4px solid transparent; /* Transparent border for gradient effect */
    background-image: linear-gradient(180deg, #c4c4c4, #f7f7f7),
      linear-gradient(180deg, #c4c4c4, #f7f7f7); /* Gradient for the border */
    background-origin: border-box;
  }

  .progress-fill {
    height: 100%;
    background: ${({ isHidden }) =>
      isHidden ? "transparent" : "linear-gradient(90deg, #74a664, #8bc34a)"};
    transition: width 0.5s ease-in-out;
    border-radius: 10px;
  }

  .level-circle {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    font-size: 14px;
    color: white;
    background-color: #e0e0e0;
    border-radius: 50%;
    border: 4px solid #c4c4c4;
    z-index: 1;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    transition:
      background-color 0.3s,
      border-color 0.3s;
  }

  .level-circle.filled {
    background-color: ${({ isHidden }) => (isHidden ? "#e0e0e0" : "#74a664")};
  }

  .level-circle.blink {
    animation: blink-animation 1.5s 1;
  }
  @keyframes blink-animation {
    0% {
      background-color: #74a664;
    }
    25% {
      background-color: ${zeeguuWarmYellow};
    }
    50% {
      background-color: #e0e0e0;
    }
    75% {
      background-color: ${zeeguuWarmYellow};
    }
    100% {
      background-color: #74a664;
    }
  }

  .level-circle.filled::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
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
    width: 28px;
    height: 28px;
  }

  .level-circle.learned {
    background-color: #74a664;
  }

  .level-circle.upcoming {
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .level-indicator {
      margin-bottom: 2em;
    }
    .progress-bar {
      height: 8px;
    }

    .level-circle {
      width: 16px;
      height: 16px;
    }

    .level-circle.filled::before {
      width: 8px;
      height: 8px;
    }

    .level-circle.final {
      width: 22px;
      height: 22px;
    }

    .school-icon {
      font-size: 18px;
    }
  }
`;

export { LevelIndicator };
