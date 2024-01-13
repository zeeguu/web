import styled from "styled-components";
import { zeeguuVeryLightOrange } from "./colors";

let TopMessage = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: auto;
  background-color: ${zeeguuVeryLightOrange};
  border-radius: 0.1em;
  max-width: 80%;
  margin-top: 4em;
  margin-bottom: 4em;
  padding: 1em 1em;
  font-size: large;
  
  @media (min-width: 768px) {
    width: 36em;
  }
`;

export { TopMessage };
