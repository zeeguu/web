import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { APIContext } from "../contexts/APIContext";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import * as s from "./Translate.sc";

export default function TranslateHistory() {
  const api = useContext(APIContext);
  const history = useHistory();

  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle("Translation History");
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function formatTime(isoString) {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true })
      .replace("about ", "");
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <s.NoResults>{error}</s.NoResults>;
  }

  if (historyItems.length === 0) {
    return (
      <s.NoResults>
        No translation history yet. Search for words in the Translate tab to see them here.
      </s.NoResults>
    );
  }

  return (
    <s.ResultsContainer>
      <s.ResultsHeader>Recent Searches</s.ResultsHeader>
      {historyItems.map((item) => (
        <s.TranslationCard
          key={item.id}
          onClick={() => handleItemClick(item)}
          style={{ cursor: "pointer" }}
        >
          <s.TranslationHeader>
            <s.TranslationInfo>
              <s.TranslationText>
                {item.search_word}
                {item.translation && (
                  <span style={{ fontWeight: 400, color: "#666", marginLeft: "0.5rem" }}>
                    → {item.translation}
                  </span>
                )}
              </s.TranslationText>
              <s.TranslationSource>
                {item.from_language} → {item.to_language}
              </s.TranslationSource>
            </s.TranslationInfo>
            <s.TranslationSource>{formatTime(item.search_time)}</s.TranslationSource>
          </s.TranslationHeader>
        </s.TranslationCard>
      ))}
    </s.ResultsContainer>
  );
}
