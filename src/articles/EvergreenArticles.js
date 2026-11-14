import { useContext, useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import ArticlePreview from "./ArticlePreview";
import { browsingModeProps } from "./browsingMode";
import LocalStorage from "../assorted/LocalStorage";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import Tag from "../pages/_pages_shared/Tag.sc";
import { FilterRow } from "../components/FilterRow.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useSelectInterest from "../hooks/useSelectInterest";
import AddKeywordModal from "./AddKeywordModal";
import * as s from "./EvergreenArticles.sc";

// The Evergreen tab: articles that don't go out of date (the crawler labels
// each article news or general), ranked by the learner's keywords and topics
// instead of by date. The server remembers what it showed, so what is new
// today comes first and what was passed by on earlier days drops behind.
// The keyword row is here, not only in settings, because keywords are what
// make this tab personal.
export default function EvergreenArticles() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { subscribedSearches, subscribeToSearch, removeSearch } = useSelectInterest(api);
  const [articles, setArticles] = useState(null);
  const [failed, setFailed] = useState(false);
  const [asking, setAsking] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setTitle(strings.evergreenTitle);
  }, []);

  // Refetch on language switch and after the keywords change. The ignore flag
  // drops a response that lands after a newer request.
  useEffect(() => {
    let ignore = false;
    setArticles(null);
    setFailed(false);
    api.getEvergreenArticles(
      (list) => !ignore && setArticles(list),
      () => !ignore && setFailed(true),
    );
    return () => {
      ignore = true;
    }; // eslint-disable-next-line
  }, [userDetails, reloadToken]);

  // subscribeToSearch updates the list of keywords when the server answers;
  // refetch once that list changes, so the new keyword's articles show.
  // The first load of the keywords is not a change: skip it, or the page
  // loads twice.
  const keywordCount = subscribedSearches ? subscribedSearches.length : null;
  const previousKeywordCount = useRef(null);
  useEffect(() => {
    if (keywordCount === null) return;
    if (previousKeywordCount.current !== null && previousKeywordCount.current !== keywordCount) {
      setReloadToken((t) => t + 1);
    }
    previousKeywordCount.current = keywordCount;
  }, [keywordCount]);

  function addKeyword(keyword) {
    setAsking(false);
    subscribeToSearch(keyword);
  }

  const keywordRow = (
    <s.KeywordSection>
      <s.SectionHeading>{strings.evergreenYourKeywords}</s.SectionHeading>
      <FilterRow $wrap>
        {(subscribedSearches || []).map((search) => (
          <Tag
            key={search.id}
            className="small selected"
            type="button"
            aria-label={`${strings.evergreenRemoveKeyword} ${search.search}`}
            onClick={() => removeSearch(search)}
          >
            {search.search}
            <CloseRoundedIcon sx={{ fontSize: "1rem" }} />
          </Tag>
        ))}
        <Tag className="small outlined-orange" type="button" onClick={() => setAsking(true)}>
          <AddRoundedIcon sx={{ fontSize: "1rem" }} />
          {strings.evergreenAddKeyword}
        </Tag>
      </FilterRow>
      <AddKeywordModal open={asking} onClose={() => setAsking(false)} onAdd={addKeyword} />
    </s.KeywordSection>
  );

  // The name is above, from the router (every Read tab says its name).
  const intro = <s.Intro>{strings.evergreenIntro}</s.Intro>;

  if (failed) {
    return (
      <>
        {intro}
        {keywordRow}
        <EmptyState message={strings.evergreenEmpty} fillHeight={false} />
      </>
    );
  }

  if (articles === null) {
    return <LoadingAnimation delay={300} />;
  }

  const fresh = articles.filter((a) => a.evergreen_new);
  const older = articles.filter((a) => !a.evergreen_new);
  const preview = (each) => (
    <ArticlePreview key={each.id} article={each} {...browsingModeProps(LocalStorage.getBrowsingMode())} />
  );

  return (
    <>
      {intro}
      {keywordRow}
      {articles.length === 0 && <EmptyState message={strings.evergreenEmpty} fillHeight={false} />}
      {fresh.length > 0 && (
        <>
          <s.SectionHeading>{strings.evergreenNewToday}</s.SectionHeading>
          {fresh.map(preview)}
        </>
      )}
      {older.length > 0 && (
        <>
          <s.SectionHeading>{strings.evergreenStillHere}</s.SectionHeading>
          {older.map(preview)}
        </>
      )}
    </>
  );
}
