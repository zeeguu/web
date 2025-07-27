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

const WordProgressWrapper  = styled.div`
  display:flex; 
  align-items: center;
  justify-content: center;
  width: 30%;
  margin: 0.1em auto 0.5em auto;
  
  @media (max-width: 768px) {
    width: 50%;
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
    height: 5px;
    background-color: #e0e0e0;
    border-radius: 5px;
    border: 2px solid transparent; /* Transparent border for gradient effect */
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
    border-radius: 5px;
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
    width: 12px;
    height: 12px;
    font-size: 10px;
    color: white;
    background-color: #e0e0e0;
    border-radius: 50%;
    border: 2px solid #c4c4c4;
    z-index: 1;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
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
    width: 6px;
    height: 6px;
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
    width: 16px;
    height: 16px;
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
      height: 4px;
    }

    .level-circle {
      width: 10px;
      height: 10px;
      border: 1px solid #c4c4c4;
    }

    .level-circle.filled::before {
      width: 4px;
      height: 4px;
    }

    .level-circle.final {
      width: 12px;
      height: 12px;
    }

    .school-icon {
      font-size: 18px;
    }
  }
`;

export { LevelIndicator, LevelWrapper, WordProgressWrapper };
