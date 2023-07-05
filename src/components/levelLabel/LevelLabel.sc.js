import styled from "styled-components";
import { levels } from "./LevelLabel";
import { zeeguuDark, zeeguuGreen, zeeguuYellow } from "../colors";

const LevelLabel = styled.span`
  margin-left: 5px;
  display: inline-block;
  user-select: none;
  pointer-events: none;
  padding: 5px;
  color: white;
  background-color: ${({ level }) => {
    switch (level) {
      case levels.easy:
        return zeeguuYellow;
      case levels.fair:
        return zeeguuGreen;
      case levels.challenging:
        return zeeguuDark;
    }
  }};
  border-radius: 50px;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 100%;
`;

export { LevelLabel };
