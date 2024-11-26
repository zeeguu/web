import styled from "styled-components";
import { darkBlue } from "./colors";

let DigitalClock = styled.div`
  display: flex;
  gap: 0.1rem;
  align-items: center;
  font-size: small;
  margin-right: 0.5em;
  font-weight: 500;
  color: ${darkBlue};

  &.disabled {
    font-weight: 300;
    color: gray;
  }
`;

export { DigitalClock };
