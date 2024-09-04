import useSelectInterest from "../hooks/useSelectInterest";
import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading";
import Main from "./_pages_shared/Main";
import ButtonContainer from "./_pages_shared/ButtonContainer";
import Footer from "./_pages_shared/Footer";
import Button from "./_pages_shared/Button";
import Tag from "./_pages_shared/Tag";
import TagContainer from "./_pages_shared/TagContainer";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import strings from "../i18n/definitions";

import redirect from "../utils/routing/routing";

export default function SelectInterests({ api }) {
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);

  return (
    <PreferencesPage>
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
    </PreferencesPage>
  );
}
