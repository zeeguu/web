import { useEffect, useState, useContext, useCallback } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";
import useRefresh from "../hooks/useRefresh";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
export default function RecommendedArticles() {
  const api = useContext(APIContext);
  const cachedArticles = api.getCachedRecommendedArticles();
  const [articleList, setArticleList] = useState(cachedArticles);
  const [originalList, setOriginalList] = useState(cachedArticles);

  const handleArticleHidden = (articleId) => {
    const updatedList = articleList.filter((item) => item.id !== articleId);
    setArticleList(updatedList);
    if (originalList) {
      const updatedOriginalList = originalList.filter((item) => item.id !== articleId);
      setOriginalList(updatedOriginalList);
    }
  };

  const fetchArticles = useCallback(() => {
    api.getRecommendedArticles((articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
  }, [api]);

  useEffect(() => {
    setTitle("Recommended Articles");
    fetchArticles();
    // eslint-disable-next-line
  }, []);

  const { refreshing, refresh } = useRefresh(() => {
    api.invalidateCache();
    return new Promise((resolve) => {
      api.getRecommendedArticles((articles) => {
        setArticleList(articles);
        setOriginalList(articles);
        resolve();
      });
    });
  });

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.YellowMessageBox>{strings.noRecommendedArticles}</s.YellowMessageBox>;
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons articleList={articleList} originalList={originalList} setArticleList={setArticleList} />
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} dontShowSourceIcon={true} onArticleHidden={handleArticleHidden} />
      ))}
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <button
          onClick={refresh}
          disabled={refreshing}
          aria-label="Refresh articles"
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "2rem",
            padding: "0.5rem 1rem",
            color: "#999",
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <RefreshRoundedIcon
            style={{
              fontSize: "1rem",
              animation: refreshing ? "spin 1s linear infinite" : "none",
            }}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
