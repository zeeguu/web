import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { APIContext } from "../contexts/APIContext";
import Tag from "../pages/_pages_shared/Tag.sc";
import * as s from "./FeedFilterBar.sc";

// Spotify-style filter row for the home feed: a gear that opens Feed
// Preferences, an always-present "All" pill (the default), then one pill per
// subscribed topic and one per saved search. Single-select — the parent owns
// the selection and reloads the feed accordingly.
//
// activeFilter shape: { type: "all" }
//                   | { type: "topic", value: <topic {id, title}> }
//                   | { type: "search", value: <search {id, search}> }
export default function FeedFilterBar({ activeFilter, onSelectFilter }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [topics, setTopics] = useState([]);
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    api.getSubscribedTopics((data) => setTopics(data || []));
    api.getSubscribedSearchers((data) => setSearches(data || []));
  }, [api]);

  const isAll = activeFilter.type === "all";
  const isTopic = (topic) => activeFilter.type === "topic" && activeFilter.value.id === topic.id;
  const isSearch = (search) => activeFilter.type === "search" && activeFilter.value.id === search.id;

  const pillClass = (selected) => (selected ? "small selected" : "small");

  return (
    <s.FilterRow>
      <s.GearButton
        onClick={() => history.push("/account_settings/interests?fromArticles=1")}
        title="Customize feed"
        aria-label="Customize feed"
      >
        <SettingsRoundedIcon style={{ fontSize: "1.1rem" }} />
      </s.GearButton>

      <Tag className={pillClass(isAll)} onClick={() => onSelectFilter({ type: "all" })}>
        All
      </Tag>

      {topics.map((topic) => (
        <Tag
          key={`topic-${topic.id}`}
          className={pillClass(isTopic(topic))}
          onClick={() => onSelectFilter({ type: "topic", value: topic })}
        >
          {topic.title}
        </Tag>
      ))}

      {searches.map((search) => (
        <Tag
          key={`search-${search.id}`}
          className={pillClass(isSearch(search))}
          onClick={() => onSelectFilter({ type: "search", value: search })}
        >
          {search.search}
        </Tag>
      ))}
    </s.FilterRow>
  );
}
