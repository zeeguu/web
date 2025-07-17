import { useEffect, useState } from "react";

export default function SimplificationLevelsNotice({ articleInfo, api }) {
  const [simplificationLevels, setSimplificationLevels] = useState([]);

  useEffect(() => {
    // Always try to fetch simplification levels for any article
    // This works for both simplified articles and original articles
    if (articleInfo?.id) {
      api.getArticleSimplificationLevels(articleInfo.id, (levels) => {
        setSimplificationLevels(levels || []);
      });
    }
  }, [articleInfo?.id, api]);

  // Show the notice if:
  // 1. It's a simplified article (has parent_article_id), OR
  // 2. We have multiple versions from the API (simplificationLevels.length > 1)
  if (!articleInfo?.parent_article_id && simplificationLevels.length <= 1) {
    return null;
  }

  const noticeStyle = {
    background: "#f8f9fa",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "6px",
    fontSize: "14px",
    borderLeft: "4px solid #0066cc",
  };

  const currentLevelStyle = {
    fontWeight: "bold",
    color: "#333",
    background: "#e3f2fd",
    padding: "2px 6px",
    borderRadius: "3px",
  };

  const levelLinkStyle = {
    color: "#0066cc",
    fontWeight: "500",
    textDecoration: "underline",
    padding: "2px 4px",
  };

  if (simplificationLevels.length > 0) {
    const originalLevel = simplificationLevels.find(level => level.is_original);
    
    return (
      <div style={noticeStyle}>
        <div>
          📄 <strong>Other versions of this article:</strong>
          {originalLevel?.url && (
            <span style={{ color: "#666", fontSize: "13px", marginLeft: "8px" }}>
              (from {new URL(originalLevel.url).hostname})
            </span>
          )}
          <div style={{ marginTop: "8px" }}>
            {simplificationLevels.map((level, index) => (
              <span key={level.id}>
                {level.id === articleInfo.id ? (
                  <span style={currentLevelStyle}>
                    {level.cefr_level || level.difficulty || "current"}
                    {level.is_original ? " (original)" : ""} (reading now)
                  </span>
                ) : (
                  <a href={`/read/article?id=${level.id}`} style={levelLinkStyle}>
                    {level.cefr_level || level.difficulty || "level"}
                    {level.is_original ? " (original)" : ""}
                  </a>
                )}
                {index < simplificationLevels.length - 1 && " • "}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={noticeStyle}>
      <div>
        📄 This is a simplified version of a {articleInfo.parent_cefr_level || "unknown"} article
        {articleInfo.parent_url ? ` in ${new URL(articleInfo.parent_url).hostname}` : ""}.{" "}
        {articleInfo.parent_url && (
          <a
            href={articleInfo.parent_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", fontWeight: "500" }}
          >
            View original
          </a>
        )}
      </div>
    </div>
  );
}