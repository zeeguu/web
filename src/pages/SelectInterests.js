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
import strings from "../i18n/definitions";

import redirect from "../utils/routing/routing";

export default function SelectInterests({ api }) {
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);

  return (
    <InfoPage>
      <Header>
        <Heading>What would you like to read&nbsp;about?</Heading>
      </Header>
      <Main>
        <TagContainer>
          {allTopics.map((topic) => (
            <Tag
              key={topic.id}
              className={isSubscribed(topic) && "selected"}
              onClick={() => toggleTopicSubscription(topic)}
            >
              {topic.title}
            </Tag>
          ))}
        </TagContainer>
      </Main>
      <Footer>
        <p>{strings.youCanChangeLater}</p>
        <ButtonContainer className={"padding-large"}>
          <Button
            className={"full-width-btn"}
            onClick={() => redirect("/exclude_words_step1")}
          >
            {strings.next}
            <ArrowForwardRoundedIcon />
          </Button>
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
