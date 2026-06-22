import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { APIContext } from "../contexts/APIContext";
import Tag from "../pages/_pages_shared/Tag.sc";
import * as s from "./FeedFilterBar.sc";

// Spotify-style feed filter. With nothing selected the full scrollable list of
// subscribed-topic pills IS the "all" state. Picking one collapses the row to
// the selected pill plus a clear-×; the × (or tapping the pill) goes back to all.
//
// activeFilter shape: { type: "all" }
//                   | { type: "topic", value: <topic {id, title}> }
export default function FeedFilterBar({ activeFilter, onSelectFilter }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.getSubscribedTopics((data) => setTopics(data || []));
  }, [api]);

  const clearToAll = () => onSelectFilter({ type: "all" });

  const gearButton = (
    <s.RoundButton
      onClick={() => history.push("/account_settings/interests?fromArticles=1")}
      title="Customize feed"
      aria-label="Customize feed"
    >
      <SettingsRoundedIcon style={{ fontSize: "1.1rem" }} />
    </s.RoundButton>
  );

  // Default: one pill per subscribed topic.
  const choosablePills = topics.map((topic) => (
    <Tag
      key={`topic-${topic.id}`}
      className="small"
      onClick={() => onSelectFilter({ type: "topic", value: topic })}
    >
      {topic.title}
    </Tag>
  ));

  // Collapsed: the selected pill plus a clear-× (tapping either resets).
  // Guard the value access — in the "all" state there is no `value`.
  const selectedLabel = activeFilter.type === "topic" ? activeFilter.value.title : null;
  // × sits after the pill so clearing isn't adjacent to the gear (avoids
  // accidentally opening settings when reaching for "clear").
  const selectionView = (
    <>
      <Tag className="small selected" onClick={clearToAll}>
        {selectedLabel}
      </Tag>
      <s.RoundButton onClick={clearToAll} title="Show all" aria-label="Clear filter">
        <CloseRoundedIcon style={{ fontSize: "1.1rem" }} />
      </s.RoundButton>
    </>
  );

  return (
    <s.FilterRow>
      {gearButton}
      {activeFilter.type === "all" ? choosablePills : selectionView}
    </s.FilterRow>
  );
}
