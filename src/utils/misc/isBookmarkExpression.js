import { isExpression } from "../preprocessing/preprocessing";

export default function isBookmarkExpression(bookmark) {
  return isExpression(bookmark.from);
}
