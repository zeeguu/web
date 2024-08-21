import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import Tag from "../info_page_shared/Tag";
import TagContainer from "../info_page_shared/TagContainer";
import useUnwantedContentPreferences from "../../hooks/useUnwantedContentPreferences";

import { PageTitle } from "../../components/PageTitle";

export default function NonInterests({ api }) {
  const { topicsAvailableForExclusion, toggleTopicExclusion, isExcludedTopic } =
    useUnwantedContentPreferences(api);
  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>{" "}
      <PageTitle>{"Non Interests"}</PageTitle>
      <TagContainer>
        {topicsAvailableForExclusion.map((topic) => (
          <Tag
            key={topic.id}
            className={isExcludedTopic(topic) && "selected"}
            onClick={() => toggleTopicExclusion(topic)}
          >
            {topic.title}
          </Tag>
        ))}
      </TagContainer>
    </div>
  );
}
