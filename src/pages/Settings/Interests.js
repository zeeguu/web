import Tag from "../_pages_shared/Tag";
import TagContainer from "../_pages_shared/TagContainer";
import useSelectInterest from "../../hooks/useSelectInterest";
import InfoPage from "../_pages_shared/InfoPage";
import Main from "../_pages_shared/Main";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";

export default function Interests({ api }) {
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);
  return (
    <InfoPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
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
    </InfoPage>
  );
}
