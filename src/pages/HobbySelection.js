import { getSessionFromCookies } from "../utils/cookies/userInfo";
import { useEffect, useState } from "react";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";
import HobbyTag from "./info_page_shared/HobbyTag";
import HobbyContainer from "./info_page_shared/HobbyContainer";

export default function HobbySelection() {
  const [hobbies, setHobbies] = useState([
    "Sports",
    "Culture & Art",
    "Technology & Science",
    "Travel & Tourism",
    "Health & Society",
    "Business",
    "Politics",
    "Satire",
  ]);
  return (
    <InfoPage>
      <Header>
        <Heading>What topics are you interested in?</Heading>
      </Header>
      <Main>
        <HobbyContainer>
          {hobbies.map((hobby, idx) => (
            <HobbyTag>{hobby}</HobbyTag>
          ))}
        </HobbyContainer>
      </Main>
      <Footer>
        <p>You can always change it later</p>
        <ButtonContainer>
          <Button href={"/install_extension"}>Next</Button>
          {/* We also need one case if someone already has an extension */}
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
