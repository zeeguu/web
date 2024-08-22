import Tag from "../info_page_shared/Tag";
import TagContainer from "../info_page_shared/TagContainer";
import useSelectInterest from "../../hooks/useSelectInterest";
import InfoPage from "../info_page_shared/InfoPage";
import Main from "../info_page_shared/Main";

import BackArrow from "../settings_pages_shared/BackArrow";

import { PageTitle } from "../../components/PageTitle";
import strings from "../../i18n/definitions";

export default function Interests({ api }) {
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);
  return (
    <InfoPage pageLocation={"settings"}>
      <BackArrow />
      <PageTitle>{strings.interests}</PageTitle>
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
