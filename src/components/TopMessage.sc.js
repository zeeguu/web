import styled from "styled-components";
import { zeeguuVeryLightOrange } from "./colors";

let YellowMessageBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 2em auto;
  background-color: ${zeeguuVeryLightOrange};
  border-radius: 1em;
  max-width: 80%;
  padding: 0.5em 0.5em;
  font-size: large;
  @media (max-width: 720px) {
    font-size: small;
  }

  @media (min-width: 768px) {
    width: 36em;
  }

  .top-message-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 720px) {
      flex-direction: column;
    }
  }
`;

export { YellowMessageBox };
