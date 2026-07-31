import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import ShareToFriendModal from "./ShareToFriendModal";

export default function ShareArticle({ articleID }) {
  const [modalOpen, setModalOpen] = useState(false);

  // Paper-plane (not the OS share glyph): the primary action is "send to a
  // friend", and it matches the Send buttons in the modal.
  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        aria-label="Share article"
        style={{ padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <SendIcon style={{ fontSize: "1.4em", color: "#999" }} />
      </div>
      <ShareToFriendModal open={modalOpen} onClose={() => setModalOpen(false)} articleID={articleID} />
    </>
  );
}
