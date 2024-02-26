import styled from "styled-components";
import { zeeguuTransparentLightOrange } from "./colors";

let TopMessage = styled.div`
  text-align: center;
  margin: auto;
  background-color: ${zeeguuTransparentLightOrange};
  border-radius: 0.9em;
  max-width: 80%;
  margin-bottom: 1.5em;
  padding: 0.4em 0.6em;
  font-size: small;
  
  @media (min-width: 768px) {
    width: 36em;
  }
`;

export { TopMessage };
