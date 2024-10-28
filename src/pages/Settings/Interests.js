import { useEffect } from "react";
import useQuery from "../../hooks/useQuery";
import Tag from "../_pages_shared/Tag.sc";
import TagContainer from "../_pages_shared/TagContainer.sc";
import useSelectInterest from "../../hooks/useSelectInterest";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";
import { setTitle } from "../../assorted/setTitle";

export default function Interests({ api }) {
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);
  const isFromArticles = useQuery().get("fromArticles") === "1";
  useEffect(() => {
    setTitle(strings.interests);
  }, []);
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow redirectLink={isFromArticles && "/articles"} />
      <Header withoutLogo>
        <Heading>{strings.interests}</Heading>
      </Header>
      <Main>
        <TagContainer>
          {allTopics.map((topic) => (
            <Tag
              key={topic.id}
              className={isSubscribed(topic) && "selected"}
              onClick={() => toggleTopicSubscription(topic)}
            >
              {" "}
              {topic.title}
            </Tag>
          ))}
        </TagContainer>
      </Main>
    </PreferencesPage>
  );
}
