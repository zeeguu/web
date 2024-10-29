import { useEffect } from "react";
import useSelectInterest from "../../hooks/useSelectInterest";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Footer from "../_pages_shared/Footer.sc";
import Button from "../_pages_shared/Button.sc";
import Tag from "../_pages_shared/Tag.sc";
import TagContainer from "../_pages_shared/TagContainer.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import strings from "../../i18n/definitions";

import redirect from "../../utils/routing/routing";
import { setTitle } from "../../assorted/setTitle";

export default function SelectInterests({ api }) {
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);

  useEffect(() => {
    setTitle(strings.selectInterests);
  }, []);

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
        <p className="centered">{strings.youCanChangeLater}</p>
        <ButtonContainer className={"padding-large"}>
          <Button
            className={"full-width-btn"}
            onClick={() => redirect("/exclude_words")}
          >
            {strings.next}
            <RoundedForwardArrow />
          </Button>
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
