/**
 * The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
 * with the required amount of bookmarks assigned to each exercise and the first set of bookmarks set as
 * currentBookmarksToStudy to begin the exercise session.
 */
function assignBookmarksToExercises(bookmarkList, exerciseSession) {
  let k = 0;

  for (let session of exerciseSession) {
    for (let i = 0; i < session.requiredBookmarks; i++) {
      session.bookmarks.push(bookmarkList[k + i]);
    }
    k += session.requiredBookmarks;
  }

  return exerciseSession;
}

/**
 * Calculates the exercise batches based on the amount of bookmarks received by the API and the amount of
 * bookmarks required per exercise type. A batch contains all exercise types. If there are not enough
 * bookmarks for a full batch, "remainingExercises" holds the amount of exercises requiring a single
 * bookmark to be added to the exercise session.
 *
 * @param bookmarks - passed to function assignBookmarksToExercises(bookmarks, exerciseSequence)
 */

function calculateExerciseSequence(exerciseTypesList, bookmark_count) {
  let exerciseSession = [];
  let exerciseType_i = 0;
  while (bookmark_count > 0) {
    if (bookmark_count >= exerciseTypesList[exerciseType_i].requiredBookmarks) {
      let exercise = {
        type: exerciseTypesList[exerciseType_i].type,
        requiredBookmarks: exerciseTypesList[exerciseType_i].requiredBookmarks,
        bookmarks: [],
      };
      exerciseSession.push(exercise);
      bookmark_count -= exerciseTypesList[exerciseType_i].requiredBookmarks;
    }
    exerciseType_i++;
    if (exerciseType_i === exerciseTypesList.length) exerciseType_i = 0;
  }
  return exerciseSession;
}

export {
    calculateExerciseSequence,
  assignBookmarksToExercises,
};
