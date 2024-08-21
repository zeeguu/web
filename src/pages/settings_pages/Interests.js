import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import Tag from "../info_page_shared/Tag";
import TagContainer from "../info_page_shared/TagContainer";
import useSelectInterest from "../../hooks/useSelectInterest";

import { PageTitle } from "../../components/PageTitle";

export default function Interests({ api }) {
  const { allTopics, toggleTopicSubscription, isSubscribed } =
    useSelectInterest(api);
  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>{" "}
      <PageTitle>{"Interests"}</PageTitle>
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
    </div>
  );
}
