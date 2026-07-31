import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import IosShareIcon from "@mui/icons-material/IosShare";
import { Capacitor } from "@capacitor/core";
import ShareToFriendModal from "./ShareToFriendModal";

export default function ShareArticle({ articleID }) {
  const [modalOpen, setModalOpen] = useState(false);
  // iOS users expect the square-with-up-arrow glyph; everywhere else the
  // Material/Android "share" glyph is the familiar one.
  const ShareGlyph = Capacitor.getPlatform() === "ios" ? IosShareIcon : ShareIcon;

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        aria-label="Share article"
        style={{ padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <ShareGlyph style={{ fontSize: "1.4em", color: "#999" }} />
      </div>
      <ShareToFriendModal open={modalOpen} onClose={() => setModalOpen(false)} articleID={articleID} />
    </>
  );
}
