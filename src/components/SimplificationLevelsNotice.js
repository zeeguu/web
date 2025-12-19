import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function SimplificationLevelsNotice({ articleInfo, api, onLevelChange, currentArticleId }) {
  const [simplificationLevels, setSimplificationLevels] = useState([]);
  const { userDetails } = useContext(UserContext);

  // Only show for users with the simplification_versions feature
  const hasFeature = userDetails?.features?.includes("simplification_versions");

  useEffect(() => {
    // Only fetch if user has the feature
    if (articleInfo?.id && hasFeature) {
      api.getArticleSimplificationLevels(articleInfo.id, (levels) => {
        setSimplificationLevels(levels || []);
      });
    }
  }, [articleInfo?.id, api, hasFeature]);

  // Don't show if user doesn't have the feature
  if (!hasFeature) {
    return null;
  }

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
    cursor: onLevelChange ? "pointer" : "default",
    border: onLevelChange ? "none" : undefined,
    background: onLevelChange ? "none" : undefined,
  };

  const handleLevelClick = (levelId) => {
    if (onLevelChange && levelId !== (currentArticleId || articleInfo.id)) {
      onLevelChange(levelId, () => {
        // Level change completed
      });
    }
  };

  if (simplificationLevels.length > 0) {
    const originalLevel = simplificationLevels.find((level) => level.is_original);

    return (
      <div style={noticeStyle}>
        <div>
          <strong>Article versions: </strong>
          {originalLevel?.url && (
            <span style={{ color: "#666", fontSize: "13px", marginLeft: "8px" }}>
              (from {new URL(originalLevel.url).hostname})
            </span>
          )}
          <span style={{ marginTop: "8px" }}>
            {simplificationLevels.map((level, index) => (
              <span key={level.id}>
                {level.id === (currentArticleId || articleInfo.id) ? (
                  <span style={currentLevelStyle}>
                    {level.cefr_level || level.difficulty || "current"}
                    {level.is_original ? " (original)" : ""}
                  </span>
                ) : onLevelChange ? (
                  <button onClick={() => handleLevelClick(level.id)} style={levelLinkStyle}>
                    {level.cefr_level || level.difficulty || "level"}
                    {level.is_original ? " (original)" : ""}
                  </button>
                ) : (
                  <a href={`/read/article?id=${level.id}`} style={levelLinkStyle}>
                    {level.cefr_level || level.difficulty || "level"}
                    {level.is_original ? " (original)" : ""}
                  </a>
                )}
                {index < simplificationLevels.length - 1 && " • "}
              </span>
            ))}
          </span>
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
