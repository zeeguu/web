import styled from "styled-components";
import {zeeguuTransparentLightOrange} from "../components/colors"

let ExtensionReminder = styled.div`
  background-color: ${zeeguuTransparentLightOrange};
  border-radius: 0.9em;
  width: 100%;
  margin-bottom: 1.5em;
  padding: 0.7em 0.7em;

  @media only screen and (max-width: 600px) {
    max-width: 92%;
}
`;

export { ExtensionReminder };
