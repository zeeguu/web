import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
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
  const { texts, error: textsError, forget } = useShortTexts();

  const [searches, setSearches] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle("Translation History");
    api
      .getTranslationHistory(50)
      .then(setSearches)
      .catch((err) => {
        console.error("Failed to load translation history:", err);
        setError("Failed to load history");
        setSearches([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatTime(isoString) {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true }).replace("about ", "");
  }

  // Both lists, or the rows would jump in one after the other
  if (searches === null || texts === null) {
    return <LoadingAnimation />;
  }

  const items = historyItems(searches, texts, userDetails?.learned_language);

  if (items.length === 0 && !error && !textsError) {
    return <EmptyState message={strings.translateHistoryEmpty} fillHeight={false} />;
  }

  return (
    <s.ResultsContainer>
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}
      {textsError && <FullWidthErrorMsg>{textsError}</FullWidthErrorMsg>}
      {items.map((item) =>
        item.search ? (
          <s.TranslationCard
            key={item.key}
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
          <s.TranslationCard key={item.key} {...opensLikeAButton(() => history.push(`/texts/read?id=${item.text.id}`))}>
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
            <TextPreview>{item.text.preview}</TextPreview>
          </s.TranslationCard>
        ),
      )}
    </s.ResultsContainer>
  );
}
