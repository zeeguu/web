import { useEffect, useState } from "react";
import { isSupportedBrowser } from "../utils/misc/browserDetection";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";
import HobbyTag from "./info_page_shared/HobbyTag";
import HobbyContainer from "./info_page_shared/HobbyContainer";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function HobbySelection({ api, hasExtension }) {
  const [availableTopics, setAvailableTopics] = useState(null);
  const [subscribedTopics, setSubscribedTopics] = useState(null);

  useEffect(() => {
    api.getAvailableTopics((data) => {
      setAvailableTopics(data);
    });

    api.getSubscribedTopics((data) => {
      setSubscribedTopics(data);
    });
  }, [api]);

  if (!availableTopics || !subscribedTopics) return "";

  let allTopics = [...availableTopics, ...subscribedTopics];
  allTopics.sort((a, b) => a.title.localeCompare(b.title));

  function togggleSelection(topic) {
    if (subscribedTopics.includes(topic)) {
      unsubscribeFromTopic(topic);
    } else {
      subscribeToTopic(topic);
    }
  }

  function subscribeToTopic(topic) {
    setSubscribedTopics([...subscribedTopics, topic]);
    setAvailableTopics(availableTopics.filter((each) => each.id !== topic.id));
    api.subscribeToTopic(topic);
  }

  function unsubscribeFromTopic(topic) {
    setSubscribedTopics(
      subscribedTopics.filter((each) => each.id !== topic.id),
    );
    setAvailableTopics([...availableTopics, topic]);
    api.unsubscribeFromTopic(topic);
  }

  function navigateToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  return (
    <InfoPage>
      <Header>
        <Heading>What topics are you interested in?</Heading>
      </Header>
      <Main>
        <HobbyContainer>
          {allTopics?.map((topic) => (
            <HobbyTag
              key={topic.id}
              className={
                subscribedTopics
                  .map((subscribedTopic) => subscribedTopic.id)
                  .includes(topic.id)
                  ? "active"
                  : ""
              }
              onClick={() => togggleSelection(topic)}
            >
              {topic.title}
            </HobbyTag>
          ))}
        </HobbyContainer>
      </Main>
      <Footer>
        <p>You can always change it later</p>
        <ButtonContainer>
          <Button href={navigateToNextPage()}>
            Next <ArrowForwardRoundedIcon />
          </Button>
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
