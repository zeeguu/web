import { isSupportedBrowser } from "../utils/misc/browserDetection";
import useSelectInterest from "../hooks/useSelectInterest";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";
import Tag from "./info_page_shared/Tag";
import TagContainer from "./info_page_shared/TagContainer";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function SelectInterests({ api, hasExtension }) {
  const { allTopics, subscribedTopics, toggleTopicSubscription } =
    useSelectInterest(api);

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
        <TagContainer>
          {allTopics?.map((topic) => (
            <Tag
              key={topic.id}
              className={
                subscribedTopics
                  .map((subscribedTopic) => subscribedTopic.id)
                  .includes(topic.id)
                  ? "selected"
                  : ""
              }
              onClick={() => toggleTopicSubscription(topic)}
            >
              {topic.title}
            </Tag>
          ))}
        </TagContainer>
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
