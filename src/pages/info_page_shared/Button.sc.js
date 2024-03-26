import styled from "styled-components";
import { zeeguuDarkOrange } from "../../components/colors";
import { OrangeRoundButton } from "../../components/allButtons.sc";

const Button = styled(OrangeRoundButton)`
  margin: 0;
  width: 16.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.2rem;
  padding: 1em 2em;
  border-radius: 4em;
  font-weight: 600;
  border-bottom: solid 0.2em ${zeeguuDarkOrange};

  @media (max-width: 768px) {
    width: auto;
    padding: 0.75em 2rem;
  }
`;

export { Button };
