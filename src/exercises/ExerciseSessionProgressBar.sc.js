import styled from "styled-components";
import {
  lightGrey,
  zeeguuLightYellow,
  zeeguuOrange,
} from "../components/colors";

const ExerciseSessionProgressBar = styled.div`
  progress[value] {
    --color: linear-gradient(89.5deg, ${zeeguuOrange}, ${zeeguuLightYellow} 100%); /* the progress color */
    --background: ${lightGrey}; /* the background color */

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    width: 100%;
    height: 0.2em;
    border-radius: 10em;
    background: var(--background);
    transition: all 0.1s linear 0s;
  }

  progress[value]::-webkit-progress-bar {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--background);
  }
  progress[value]::-webkit-progress-value {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--color);
  }
  progress[value]::-moz-progress-bar {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--color);
  }
`;

export { ExerciseSessionProgressBar };
