import styled from "styled-components";
import { zeeguuWarmYellow } from "../../../components/colors";

const LevelWrapper = styled.div`
  margin-left: auto;
  display: flex; // if LevelIndicator needs layout
  align-items: right;
  padding-right: 1em;
  @media (max-width: 800px) {
    margin-left: 0;
    width: 100%;          
    margin-top: 0.5em;
    justify-content: flex-start;     
    padding-right: 1em;
    margin-right: 1em;
    padding-left: 1em;
  }
`;

const LevelIndicator = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  align-items: flex-start;
  width: 250px;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard */
  

  .level-indicator {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 16px;
    padding: 8px;
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
    background: ${({ isGreyedOutBar }) =>
      isGreyedOutBar
        ? "transparent"
        : "linear-gradient(90deg, #74a664, #8bc34a)"};
    transition: width 0.5s ease-in-out;
    border-radius: 10px;
  }

  .level-circles-wrapper {
  display: flex;
  gap: 6px; // or use justify-content
  position: relative; // if needed for alignment
  width: 100%;
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
    background-color: ${({ isGreyedOutBar }) =>
      isGreyedOutBar ? "#e0e0e0" : "#74a664"};
  }

  .level-circle.blink {
    animation: blink-animation 0.75s 2 alternate;

    @keyframes blink-animation {
      0% {
        background-color: #74a664;
      }
      100% {
        background-color: ${zeeguuWarmYellow};
      }
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

export { LevelIndicator, LevelWrapper };
