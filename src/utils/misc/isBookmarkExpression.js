import { isExpression } from "../text/preprocessing";

export default function isBookmarkExpression(bookmark) {
  return isExpression(bookmark.from);
}
