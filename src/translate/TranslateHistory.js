import React, { useContext, useMemo, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { SpeechContext } from "../contexts/SpeechContext";
import InteractiveText from "../reader/InteractiveText";
import { TranslatableText } from "../reader/TranslatableText";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import { setTitle } from "../assorted/setTitle";
import useShortTexts from "../texts/useShortTexts";
import { languageName } from "../utils/misc/languageCodeToName";
import strings from "../i18n/definitions";
import { historyItems } from "./historyItems";
import { opensLikeAButton } from "../utils/input/keys";
import * as s from "./Translate.sc";

const PAGE_SIZE = 20;

// A text's row: when (and the language, if not the learned one) on the left
// and × on the right, on one line; the start of the text below, full width
const TextMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
`;

const TextPreview = styled.div`
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LoadMoreRow = styled.div`
  text-align: center;
  margin: 0.5rem 0 1.5rem;
`;

const LoadMoreButton = styled.button`
  background: none;
  border: 1px solid var(--border-light);
  border-radius: 0.4rem;
  padding: 0.5rem 1.25rem;
  font: inherit;
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

function ShortTextPreview({ text }) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const interactiveText = useMemo(() => {
    if (!text.tokenized_paragraphs?.length || !text.past_bookmarks?.length) return null;
    // Flatten lines into one paragraph so the 3-line clamp matches plain preview
    return new InteractiveText({
      tokenizedParagraphs: [text.tokenized_paragraphs.flat()],
      previousBookmarks: text.past_bookmarks,
      api,
      language: text.language,
      zeeguuSpeech: speech || { language: text.language },
    });
  }, [text, api, speech]);

  if (!interactiveText) return <TextPreview>{text.preview}</TextPreview>;
  return (
    <TextPreview>
      <TranslatableText
        interactiveText={interactiveText}
        translating={false}
        pronouncing={false}
        nonInteractive={true}
      />
    </TextPreview>
  );
}

// Not SavedArticleRow's RemoveButton: that one is placed absolutely over its row
const RemoveText = styled.button`
  background: none;
  border: none;
  padding: 0 0.25rem;
  font-size: 1.3em;
  line-height: 1;
  margin-left: auto;
  color: var(--text-muted);
  cursor: pointer;
`;

export default function TranslateHistory() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const { texts, error: textsError, hasMore: hasMoreTexts, loadMore: loadMoreTexts, forget } = useShortTexts(PAGE_SIZE);

  const [searches, setSearches] = useState(null);
  const [hasMoreSearches, setHasMoreSearches] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle("Translation History");
    api
      .getTranslationHistory(PAGE_SIZE, 0)
      .then((page) => {
        setSearches(page);
        setHasMoreSearches(page.length === PAGE_SIZE);
      })
      .catch((err) => {
        console.error("Failed to load translation history:", err);
        setError("Failed to load history");
        setSearches([]);
        setHasMoreSearches(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLoadMore() {
    const nextVisible = visibleCount + PAGE_SIZE;
    const tasks = [];
    // Keep both buffers at least `nextVisible` deep (or exhausted) so the
    // merged top-N order never shifts earlier items when a new page arrives.
    if (hasMoreSearches && (searches?.length || 0) < nextVisible) {
      tasks.push(
        api
          .getTranslationHistory(PAGE_SIZE, searches.length)
          .then((page) => {
            setSearches((current) => {
              const seen = new Set((current || []).map((each) => each.id));
              return [...(current || []), ...page.filter((each) => !seen.has(each.id))];
            });
            setHasMoreSearches(page.length === PAGE_SIZE);
          })
          .catch((err) => {
            console.error("Failed to load more translation history:", err);
            setHasMoreSearches(false);
          }),
      );
    }
    if (hasMoreTexts && (texts?.length || 0) < nextVisible) {
      tasks.push(loadMoreTexts());
    }
    if (tasks.length > 0) {
      setLoadingMore(true);
      await Promise.all(tasks);
      setLoadingMore(false);
    }
    setVisibleCount(nextVisible);
  }

  function formatTime(isoString) {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true }).replace("about ", "");
  }

  // Both lists, or the rows would jump in one after the other
  if (searches === null || texts === null) {
    return <LoadingAnimation />;
  }

  const allItems = historyItems(searches, texts, userDetails?.learned_language);
  const visibleItems = allItems.slice(0, visibleCount);
  const canLoadMore = visibleCount < allItems.length || hasMoreSearches || hasMoreTexts;

  if (allItems.length === 0 && !error && !textsError) {
    return <EmptyState message={strings.translateHistoryEmpty} fillHeight={false} />;
  }

  return (
    <s.ResultsContainer>
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}
      {textsError && <FullWidthErrorMsg>{textsError}</FullWidthErrorMsg>}
      {visibleItems.map((item) =>
        item.search ? (
          <s.TranslationCard
            key={item.key}
            style={{ cursor: "pointer" }}
            {...opensLikeAButton(() => history.push("/translate", { searchWord: item.search.search_word }))}
          >
            <s.TranslationHeader>
              <s.TranslationInfo>
                <s.TranslationText>{item.search.search_word}</s.TranslationText>
              </s.TranslationInfo>
              <s.TranslationSource>{formatTime(item.search.search_time)}</s.TranslationSource>
            </s.TranslationHeader>
          </s.TranslationCard>
        ) : (
          <s.TranslationCard
            key={item.key}
            style={{ cursor: "pointer" }}
            {...opensLikeAButton(() =>
              history.push(`/texts/read?id=${item.text.id}`, { shortText: item.text }),
            )}
          >
            <TextMeta>
              <s.TranslationSource>{formatTime(item.text.last_opened_at)}</s.TranslationSource>
              {item.otherLanguage && <s.TranslationSource>{languageName(item.otherLanguage)}</s.TranslationSource>}
              <RemoveText
                aria-label={strings.removeText}
                title={strings.removeText}
                onClick={(e) => {
                  e.stopPropagation();
                  forget(item.text.id);
                }}
              >
                ×
              </RemoveText>
            </TextMeta>
            <ShortTextPreview text={item.text} />
          </s.TranslationCard>
        ),
      )}
      {canLoadMore && (
        <LoadMoreRow>
          <LoadMoreButton type="button" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </LoadMoreButton>
        </LoadMoreRow>
      )}
    </s.ResultsContainer>
  );
}
