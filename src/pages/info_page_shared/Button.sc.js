import styled from "styled-components";
import { zeeguuDarkOrange } from "../../components/colors";
import { OrangeRoundButton } from "../../components/allButtons.sc";

const ButtonLink = styled.a`
  flex: 1;
  max-width: 65%;
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const Button = styled(OrangeRoundButton)`
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.2rem;
  padding: 1em 2rem;
  border-radius: 4em;
  font-weight: 600;
  border-bottom: solid 0.2em ${zeeguuDarkOrange};

  @media (max-width: 768px) {
    width: auto;
    padding: 0.75em 2rem;
  }
`;

export { Button, ButtonLink };
