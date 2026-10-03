import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";
import useFunnelStep from "../../hooks/useFunnelStep";
import styled from "styled-components";

import CardPage from "../_pages_shared/CardPage";
import Header from "../_pages_shared/Header";
import PageTitle from "../_pages_shared/PageTitle.sc";
import Main from "../_pages_shared/Main.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";

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
  const api = useContext(APIContext);
  useFunnelStep("welcome");

  useEffect(() => {
    setTitle("Welcome to Zeeguu");
  }, []);

  function handleHasAccount() {
    api.funnelEvent("welcome_login_chosen");
    history.push("/log_in");
  }

  function handleNewUser() {
    api.funnelEvent("welcome_new_user_chosen");
    history.push("/invite_code");
  }

  return (
    <CardPage pageWidth={"narrow"} isBackgroundFixed={true}>
      <Header>
        <PageTitle>Welcome to Zeeguu</PageTitle>
      </Header>
      <Main>
        <ButtonGroup>
          <Button onClick={handleHasAccount} className="full-width-btn">
            Log in
          </Button>
          <SecondaryButton onClick={handleNewUser} className="full-width-btn">
            Create account
          </SecondaryButton>
        </ButtonGroup>
      </Main>
    </CardPage>
  );
}
