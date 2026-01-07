import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { setTitle } from "../../assorted/setTitle";
import styled from "styled-components";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2em;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
`;

const SecondaryButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default function Welcome() {
  const history = useHistory();

  useEffect(() => {
    setTitle("Welcome to Zeeguu");
  }, []);

  function handleHasAccount() {
    history.push("/log_in");
  }

  function handleNewUser() {
    history.push("/language_preferences");
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>Welcome to Zeeguu</Heading>
      </Header>
      <Main>
        <Subtitle>Do you already have an account?</Subtitle>
        <ButtonGroup>
          <Button onClick={handleHasAccount} className="full-width-btn">
            Yes, log me in
          </Button>
          <SecondaryButton onClick={handleNewUser} className="full-width-btn">
            No, I'm new here
          </SecondaryButton>
        </ButtonGroup>
      </Main>
    </PreferencesPage>
  );
}
