import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
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
//                   | { type: "search", value: { search: <typed text> } }
//
// Search sits next to the gear: the magnifier turns the row into a text field,
// and Enter selects the typed text like any other pill. What a search looks in
// is the tab's business -- the bar only says so in `searchPlaceholder`.
//
// Keyword pills are opt-in (the Evergreen tab): pass `keywords` to list them
// after the topics, `onSaveSearch` for a button that keeps a search as a
// keyword, and `onRemoveKeyword` for a delete button while a keyword is
// selected. The news feed shows topics only.
export default function FeedFilterBar({
  activeFilter,
  onSelectFilter,
  searchPlaceholder,
  keywords,
  onSaveSearch,
  onRemoveKeyword,
}) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [topics, setTopics] = useState([]);
  const [typing, setTyping] = useState(false);
  const [term, setTerm] = useState("");

  useEffect(() => {
    api.getSubscribedTopics((data) => setTopics(data || []));
  }, [api]);

  const clearToAll = () => onSelectFilter({ type: "all" });

  function startTyping() {
    setTerm("");
    setTyping(true);
  }

  function submitSearch(e) {
    e.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    api.logUserActivity(api.SEARCH_QUERY, "", trimmed, "");
    setTyping(false);
    onSelectFilter({ type: "search", value: { search: trimmed } });
  }

  const gearButton = (
    <s.RoundButton
      onClick={() => history.push("/account_settings/interests?fromArticles=1")}
      title="Customize feed"
      aria-label="Customize feed"
    >
      <SettingsRoundedIcon style={{ fontSize: "1.1rem" }} />
    </s.RoundButton>
  );

  const searchButton = searchPlaceholder && (
    <s.RoundButton onClick={startTyping} title={searchPlaceholder} aria-label={searchPlaceholder}>
      <SearchRoundedIcon style={{ fontSize: "1.1rem" }} />
    </s.RoundButton>
  );

  // The row while typing: the field takes the place of the pills, × gives up.
  const typingView = (
    <>
      <s.SearchForm onSubmit={submitSearch} role="search">
        <s.SearchInput
          type="search"
          inputMode="search"
          enterKeyHint="search"
          placeholder={searchPlaceholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          autoFocus
          autoComplete="off"
        />
      </s.SearchForm>
      <s.RoundButton onClick={() => setTyping(false)} title={strings.cancel} aria-label={strings.cancel}>
        <CloseRoundedIcon style={{ fontSize: "1.1rem" }} />
      </s.RoundButton>
    </>
  );

  // Default: one pill per subscribed topic, then one per keyword.
  const choosablePills = [
    ...topics.map((topic) => (
      <Tag key={`topic-${topic.id}`} className="small" onClick={() => onSelectFilter({ type: "topic", value: topic })}>
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
      : activeFilter.type === "keyword" || activeFilter.type === "search"
        ? activeFilter.value.search
        : null;
  const searchPill = (
    <Tag className="small selected" onClick={clearToAll}>
      <SearchRoundedIcon style={{ fontSize: "1rem", verticalAlign: "middle", marginRight: "0.25rem" }} />
      {selectedLabel}
    </Tag>
  );
  const plainPill = (
    <Tag className="small selected" onClick={clearToAll}>
      {selectedLabel}
    </Tag>
  );
  // × sits after the pill so clearing isn't adjacent to the gear (avoids
  // accidentally opening settings when reaching for "clear").
  const selectionView = (
    <>
      {activeFilter.type === "search" ? searchPill : plainPill}
      <s.RoundButton onClick={clearToAll} title="Show all" aria-label="Clear filter">
        <CloseRoundedIcon style={{ fontSize: "1.1rem" }} />
      </s.RoundButton>
      {activeFilter.type === "search" && onSaveSearch && (
        <s.RoundButton
          onClick={() => onSaveSearch(activeFilter.value.search)}
          title={strings.keepAsKeyword}
          aria-label={strings.keepAsKeyword}
        >
          <BookmarkAddRoundedIcon style={{ fontSize: "1.1rem" }} />
        </s.RoundButton>
      )}
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

  const rowContent = typing ? (
    typingView
  ) : activeFilter.type === "all" ? (
    <>
      {searchButton}
      {choosablePills}
    </>
  ) : (
    selectionView
  );

  return (
    // The row scrolls horizontally on its own; opt it out of the parent
    // tab-swipe so dragging the pills scrolls topics instead of switching tabs.
    <s.FilterRow data-tab-swipe-ignore>
      {gearButton}
      {rowContent}
    </s.FilterRow>
  );
}
