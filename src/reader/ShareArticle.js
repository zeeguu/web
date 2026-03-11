import { toast } from "react-toastify";
import ShareIcon from "@mui/icons-material/Share";

export default function ShareArticle({ articleID }) {
  const shareUrl = `https://zeeguu.org/read/article?id=${articleID}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this article on Zeeguu",
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch (err) {
      // Fallback for HTTP / older browsers
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
    <div
      onClick={handleShare}
      aria-label="Share article"
      style={{ padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <ShareIcon style={{ fontSize: "1.4em", color: "#999" }} />
    </div>
  );
}
