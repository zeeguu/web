export default function BookmarkButton({ bookmarked, toggleBookmarkedState }) {
  let fileName = (bookmarked ? "bookmarked" : "not-bookmarked") + ".svg";
  let altText = (bookmarked ? "Remove from" : "Add to") + "bookmarks";

  return (
    <>
      <span className="tooltiptext">{altText}</span>
      <img
        onClick={toggleBookmarkedState}
        src={"/static/images/" + fileName}
        alt={altText}
      />
    </>
  );
}
