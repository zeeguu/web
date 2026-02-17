import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { APIContext } from "../contexts/APIContext";
import LoadingAnimation from "../components/LoadingAnimation";
import { zeeguuOrange } from "../components/colors";
import { setTitle } from "../assorted/setTitle";

const Container = styled.div`
  margin-top: 1rem;
`;

const Header = styled.h3`
  margin-bottom: 1rem;
  font-weight: 500;
  color: #333;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HistoryItem = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${zeeguuOrange};
  }
`;

const WordInfo = styled.div`
  flex: 1;
`;

const SearchWord = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const Translation = styled.span`
  color: #666;
  margin-left: 0.5rem;
`;

const Arrow = styled.span`
  color: #999;
  margin: 0 0.5rem;
`;

const LanguageInfo = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
`;

const TimeStamp = styled.div`
  font-size: 0.8rem;
  color: #999;
  white-space: nowrap;
  margin-left: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-style: italic;
`;

function formatTimeAgo(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export default function TranslateHistory() {
  const api = useContext(APIContext);
  const history = useHistory();

  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle("Translation History");
    loadHistory();
  }, []);

  function loadHistory() {
    setIsLoading(true);
    setError("");

    api.getTranslationHistory(50)
      .then((data) => {
        setHistoryItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load translation history:", err);
        setError("Failed to load history");
        setIsLoading(false);
      });
  }

  function handleItemClick(item) {
    history.push("/translate", { searchWord: item.search_word });
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <EmptyState>{error}</EmptyState>;
  }

  if (historyItems.length === 0) {
    return (
      <EmptyState>
        No translation history yet. Search for words in the Translate tab to see them here.
      </EmptyState>
    );
  }

  return (
    <Container>
      <Header>Recent Searches</Header>
      <HistoryList>
        {historyItems.map((item) => (
          <HistoryItem key={item.id} onClick={() => handleItemClick(item)}>
            <WordInfo>
              <div>
                <SearchWord>{item.search_word}</SearchWord>
                {item.translation && (
                  <>
                    <Arrow>→</Arrow>
                    <Translation>{item.translation}</Translation>
                  </>
                )}
              </div>
              <LanguageInfo>
                {item.from_language} → {item.to_language}
              </LanguageInfo>
            </WordInfo>
            <TimeStamp>{formatTimeAgo(item.search_time)}</TimeStamp>
          </HistoryItem>
        ))}
      </HistoryList>
    </Container>
  );
}
