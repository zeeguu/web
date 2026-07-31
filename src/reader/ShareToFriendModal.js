import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import LinkIcon from "@mui/icons-material/Link";
import Modal from "../components/modal_shared/Modal";
import { APIContext } from "../contexts/APIContext";

// Share hub for a reader article: send it to a Zeeguu friend (on-platform), or
// fall back to an external link / OS share. On-platform, the friend receives the
// article adapted to *their* language and level — the server stores the original
// article id, and the recipient's reader adapts it on open.
export default function ShareToFriendModal({ open, onClose, articleID }) {
  const api = useContext(APIContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [sentTo, setSentTo] = useState([]); // usernames already shared with, this session
  const [sendingTo, setSendingTo] = useState(null); // username currently in flight

  const shareUrl = `https://zeeguu.org/read/article?id=${articleID}`;

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.getFriends((data) => {
      setFriends(data || []);
      setLoading(false);
    });
  }, [api, open]);

  const handleSend = (friend) => {
    setSendingTo(friend.username);
    api
      .shareArticleWithFriend(friend.username, articleID, note.trim() || undefined)
      .then(() => {
        setSentTo((prev) => [...prev, friend.username]);
        setSendingTo(null);
        toast.success(`Shared with ${friend.name || friend.username}`);
      })
      .catch(() => {
        setSendingTo(null);
        toast.error("Could not share the article.");
      });
  };

  const handleExternalShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Check out this article on Zeeguu", url: shareUrl });
        return;
      } catch (err) {
        // cancelled or unsupported — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Link copied!");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 style={{ marginTop: 0, marginBottom: "0.25rem" }}>Send to a friend</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Your friend gets it in the language they're learning, at their level.
      </p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)"
        maxLength={500}
        rows={2}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          resize: "vertical",
          marginBottom: "1rem",
          fontFamily: "inherit",
        }}
      />

      {loading && <p style={{ color: "var(--text-secondary)" }}>Loading your friends…</p>}

      {!loading && friends.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>
          You don't have any friends on Zeeguu yet — add some from your profile to share articles.
        </p>
      )}

      {!loading && friends.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "40vh", overflowY: "auto" }}>
          {friends.map((friend) => {
            const already = sentTo.includes(friend.username);
            const sending = sendingTo === friend.username;
            return (
              <li
                key={friend.username}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <span style={{ color: "var(--text-primary)" }}>{friend.name || friend.username}</span>
                <button
                  onClick={() => handleSend(friend)}
                  disabled={sending || already}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.35rem 0.8rem",
                    borderRadius: "6px",
                    border: already ? "1px solid var(--border-color)" : "1px solid #2481f6",
                    background: already ? "var(--bg-tertiary)" : "#2481f6",
                    color: already ? "var(--text-muted)" : "#fff",
                    cursor: already || sending ? "default" : "pointer",
                  }}
                >
                  <SendIcon style={{ fontSize: "1rem" }} />
                  {already ? "Sent" : sending ? "Sending…" : "Send"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={handleExternalShare}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          width: "100%",
          justifyContent: "center",
          marginTop: "1.25rem",
          padding: "0.5rem 0.8rem",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          background: "transparent",
          color: "var(--text-secondary)",
          cursor: "pointer",
        }}
      >
        <LinkIcon style={{ fontSize: "1.1rem" }} />
        Copy link / share elsewhere
      </button>
    </Modal>
  );
}
