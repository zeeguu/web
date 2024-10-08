import { isExpression } from "../text/expressions";

export default function isBookmarkExpression(bookmark) {
  return isExpression(bookmark.from);
}
