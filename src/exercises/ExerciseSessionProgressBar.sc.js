import styled from "styled-components";
import {
  lightGrey,
  zeeguuLightYellow,
  zeeguuOrange,
} from "../components/colors";

const ExerciseSessionProgressBar = styled.div`
  .progress-module {
    margin: 20px auto 40px;
    max-width: 800px;
    border-radius: 15px;
  }

  .ex-progress {
    position: relative;
    width: 100%;
    height: 25px;
    background-color: ${lightGrey};
    border-radius: 15px;
    overflow: hidden;
  }

  #ex-bar {
    position: absolute;
    width: 0%;
    height: 100%;
    background: linear-gradient(
      89.5deg,
      ${zeeguuOrange},
      ${zeeguuLightYellow} 100%
    );
    transition: all 0.5s;
    border-radius: 15px;
  }
`;

export { ExerciseSessionProgressBar };
