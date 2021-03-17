import strings from "../i18n/definitions";

export default function BookmarkButton({ bookmarked, toggleBookmarkedState }) {
  let fileName = (bookmarked ? "bookmarked" : "not-bookmarked") + ".svg";
  let actionDescription =
    //(bookmarked ? "Remove from" : "Add to") + " bookmarks";
    (bookmarked ? strings.removeFromBookmarks : strings.addToBookmarks)

  return (
    <>
      <span className="tooltiptext">{actionDescription}</span>
      <img
        onClick={toggleBookmarkedState}
        src={"/static/images/" + fileName}
        alt={actionDescription}
      />
    </>
  );
}
