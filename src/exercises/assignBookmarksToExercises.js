/**
 * The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
 * with the required amount of bookmarks assigned to each exercise and the first set of bookmarks set as
 * currentBookmarksToStudy to begin the exercise session.
 */
function assignBookmarksToExercises(bookmarks, exerciseTypesList) {

    console.log("about to test:")
    console.log(bookmarks);

    let exerciseSequence = [];
    let exerciseType_i = 0;
    let bookmark_i = 0;

    while (bookmark_i < bookmarks.length) {
        let currExRequiredBookmarks = exerciseTypesList[exerciseType_i].requiredBookmarks;

        if (bookmark_i + currExRequiredBookmarks <= bookmarks.length) {
            let exercise = {
                type: exerciseTypesList[exerciseType_i].type,
                bookmarks: bookmarks.slice(bookmark_i, bookmark_i + currExRequiredBookmarks)
            };
            exerciseSequence.push(exercise);
            bookmark_i += currExRequiredBookmarks;
        }
        exerciseType_i++;
        if (exerciseType_i === exerciseTypesList.length) exerciseType_i = 0;
    }
    return exerciseSequence;

}


export {

    assignBookmarksToExercises,
};
