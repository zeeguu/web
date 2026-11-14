import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { APIContext } from "../contexts/APIContext";
import Tag from "../pages/_pages_shared/Tag.sc";
import strings from "../i18n/definitions";
import * as s from "./FeedFilterBar.sc";

// Spotify-style feed filter. With nothing selected the full scrollable list of
// subscribed-topic pills IS the "all" state. Picking one collapses the row to
// the selected pill plus a clear-×; the × (or tapping the pill) goes back to all.
//
// activeFilter shape: { type: "all" }
//                   | { type: "topic", value: <topic {id, title}> }
//                   | { type: "keyword", value: <search {id, search}> }
//
// Keyword pills are opt-in (the Evergreen tab): pass `keywords` to list them
// after the topics, `onAddKeyword` for a "+" next to the gear, and
// `onRemoveKeyword` for a delete button while a keyword is selected. The news
// feed shows topics only (saved-search pills were dropped from it in Jun 2026).
export default function FeedFilterBar({ activeFilter, onSelectFilter, keywords, onAddKeyword, onRemoveKeyword }) {
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

  const addButton = onAddKeyword && (
    <s.RoundButton onClick={onAddKeyword} title={strings.evergreenAddKeyword} aria-label={strings.evergreenAddKeyword}>
      <AddRoundedIcon style={{ fontSize: "1.1rem" }} />
    </s.RoundButton>
  );

  // Default: one pill per subscribed topic, then one per keyword.
  const choosablePills = [
    ...topics.map((topic) => (
      <Tag
        key={`topic-${topic.id}`}
        className="small"
        onClick={() => onSelectFilter({ type: "topic", value: topic })}
      >
        {topic.title}
      </Tag>
    )),
    ...(keywords || []).map((keyword) => (
      <Tag
        key={`keyword-${keyword.id}`}
        className="small outlined-orange"
        onClick={() => onSelectFilter({ type: "keyword", value: keyword })}
      >
        {keyword.search}
      </Tag>
    )),
  ];

  // Collapsed: the selected pill plus a clear-× (tapping either resets).
  // Guard the value access — in the "all" state there is no `value`.
  const selectedLabel =
    activeFilter.type === "topic"
      ? activeFilter.value.title
      : activeFilter.type === "keyword"
        ? activeFilter.value.search
        : null;
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
      {activeFilter.type === "keyword" && onRemoveKeyword && (
        <s.RoundButton
          onClick={() => onRemoveKeyword(activeFilter.value)}
          title={strings.evergreenRemoveKeyword}
          aria-label={`${strings.evergreenRemoveKeyword} ${selectedLabel}`}
        >
          <DeleteOutlineRoundedIcon style={{ fontSize: "1.1rem" }} />
        </s.RoundButton>
      )}
    </>
  );

  return (
    // The row scrolls horizontally on its own; opt it out of the parent
    // tab-swipe so dragging the pills scrolls topics instead of switching tabs.
    <s.FilterRow data-tab-swipe-ignore>
      {gearButton}
      {activeFilter.type === "all" && addButton}
      {activeFilter.type === "all" ? choosablePills : selectionView}
    </s.FilterRow>
  );
}
