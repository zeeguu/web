import { toast } from "react-toastify";
import ShareIcon from "@mui/icons-material/Share";
import styled from "styled-components";
import { darkGrey } from "../components/colors";

const ShareLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${darkGrey};
  font-size: small;
  font-weight: 500;
  font-family: "Montserrat";
  text-decoration: underline;
  text-underline-offset: 2px;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;

  &:hover {
    opacity: 0.7;
  }
`;

export default function ShareArticle({ articleID }) {
  const shareUrl = `https://zeeguu.org/read/article?id=${articleID}`;

  const handleShare = async () => {
    // Try native share API first (mobile)
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

    // Fall back to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <ShareLink onClick={handleShare}>
      <ShareIcon style={{ fontSize: "1em" }} />
      share
    </ShareLink>
  );
}
