import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import { APIContext } from "../contexts/APIContext";
import { SharedArticlesContext } from "../contexts/SharedArticlesContext";

// "Shared with you" inbox. Each row deep-links to the ORIGINAL article; the
// reader's language modal then adapts it to the recipient's own language and
// level on open. The list + unread count come from SharedArticlesContext.
export default function SharedWithMe() {
  const api = useContext(APIContext);
  const history = useHistory();
  const { sharedArticles, refreshSharedArticles } = useContext(SharedArticlesContext);

  const handleOpen = (share) => {
    api.markSharedArticleRead(share.id);
    history.push(`/read/article?id=${share.article.id}`);
  };

  const handleDismiss = (event, share) => {
    event.stopPropagation();
    api
      .dismissSharedArticle(share.id)
      .then(() => refreshSharedArticles())
      .catch(() => toast.error("Could not dismiss."));
  };

  if (!sharedArticles || sharedArticles.length === 0) {
    return (
      <p style={{ color: "var(--text-secondary)" }}>
        Nothing shared with you yet. When a friend shares an article, it shows up here in the language you're
        learning.
      </p>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {sharedArticles.map((share) => (
        <li
          key={share.id}
          onClick={() => handleOpen(share)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            padding: "0.85rem 0.5rem",
            borderBottom: "1px solid var(--border-color)",
            cursor: "pointer",
            background: share.read ? "transparent" : "var(--bg-secondary)",
          }}
        >
          {!share.read && (
            <span
              aria-label="Unread"
              style={{
                flexShrink: 0,
                marginTop: "0.45rem",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2481f6",
              }}
            />
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.85em", color: "var(--text-secondary)" }}>
              {share.from_user_name} shared an article
            </div>
            {share.note && (
              <div style={{ fontStyle: "italic", color: "var(--text-secondary)", margin: "0.15rem 0" }}>
                “{share.note}”
              </div>
            )}
            <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>
              {share.article?.title || "Untitled article"}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
            <OpenInNewIcon style={{ fontSize: "1.1rem", color: "#2481f6" }} />
            <button
              onClick={(event) => handleDismiss(event, share)}
              aria-label="Dismiss"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.2rem", display: "flex" }}
            >
              <CloseIcon style={{ fontSize: "1.1rem" }} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
