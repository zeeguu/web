import { MAX_BOOKMARKS_PER_ARTILE } from "./ExerciseConstants.js";

export default function prioritizeBookmarksToStudy(
  api,
  articleID,
  setUpdatedBookmarks,
) {
  api.bookmarksForArticle(articleID, (bookmarks) => {
    let seenBookmarks = new Set([]);
    console.log(seenBookmarks);
    let sortedBookmarks = [...bookmarks].sort(
      (bookmark_a, bookmark_b) =>
        bookmark_b.origin_importance - bookmark_a.origin_importance,
    );
    let addedBookmarks = 0;
    for (let i = 0; i < sortedBookmarks.length; i++) {
      let bookmark = sortedBookmarks[i];
      if (
        bookmark.from.split(" ").length < 3 &&
        !seenBookmarks.has(bookmark.from.toLowerCase()) &&
        addedBookmarks < MAX_BOOKMARKS_PER_ARTILE
      ) {
        if (!bookmark.fit_for_study) api.setIsFitForStudy(bookmark.id);
        seenBookmarks.add(bookmark.from.toLowerCase());
        bookmark.fit_for_study = true;
        if (!bookmark.starred) addedBookmarks += 1;
      } else {
        if (bookmark.fit_for_study && !bookmark.starred) {
          api.setNotFitForStudy(bookmark.id);
          bookmark.fit_for_study = false;
        }
      }
    }
    if (setUpdatedBookmarks) setUpdatedBookmarks(bookmarks);
  });
}
