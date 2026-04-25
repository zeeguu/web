import { useContext, useEffect } from "react";
import useQuery from "../../hooks/useQuery";
import Tag from "../_pages_shared/Tag.sc";
import TagContainer from "../_pages_shared/TagContainer.sc";
import useSelectInterest from "../../hooks/useSelectInterest";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";

export default function Interests() {
  const api = useContext(APIContext);
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);
  const isFromArticles = useQuery().get("fromArticles") === "1";
  useEffect(() => {
    setTitle("Topics of Interest");
  }, []);
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow redirectLink={isFromArticles && "/articles"} />
      <Header withoutLogo>
        <Heading>Topics of Interest</Heading>
      </Header>
      <Main>
        <div
          style={{
            fontSize: "1rem",
            marginBottom: 0,
            textAlign: "left",
            width: "100%",
          }}
        >
          Show me articles about the following topics:
        </div>
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
