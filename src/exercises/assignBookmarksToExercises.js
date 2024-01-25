import {NUMBER_OF_BOOKMARKS_TO_PRACTICE} from "./exerciseSequenceTypes";

/**
 * The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
 * with the required amount of bookmarks assigned to each exercise and the first set of bookmarks set as
 * currentBookmarksToStudy to begin the exercise session.
 */
function assignBookmarksToExercises(bookmarkList, exerciseSession) {
    let k = 0;

    for (let session of exerciseSession) {
        for (let i=0; i< session.requiredBookmarks; i++) {
            session.bookmarks.push(bookmarkList[k + i]);
        }
        k+= session.requiredBookmarks;
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
function calculateExerciseSequence(exerciseSequenceType, bookmarks) {

    let bookmarksPerBatch = exerciseSequenceType.reduce(
        (a, b) => a + b.requiredBookmarks,
        0
    );

    let batchCount = parseInt(bookmarks.length / bookmarksPerBatch);
    let remainingExercises = bookmarks.length % bookmarksPerBatch;

    let exerciseSequence = defineExerciseSession(
        exerciseSequenceType,
        batchCount,
        remainingExercises,
        bookmarks.length
    );
    return exerciseSequence
}




function defineExerciseSession(exerciseTypesList, batches, rest, bookmark_count) {

    let exerciseSession = [];
    if (bookmark_count < NUMBER_OF_BOOKMARKS_TO_PRACTICE) {
        let count = bookmark_count;
        while (count > 0) {
            for (let i = exerciseTypesList.length - 1; i >= 0; i--) {
                let currentTypeRequiredCount = exerciseTypesList[i].requiredBookmarks;
                if (count < currentTypeRequiredCount) continue;
                if (count === 0) break;
                let exercise = {
                    type: exerciseTypesList[i].type,
                    requiredBookmarks: currentTypeRequiredCount,
                    bookmarks: [],
                };
                exerciseSession.push(exercise);
                count = count - currentTypeRequiredCount;
            }
        }
    } else {
        for (let i = 0; i < batches; i++) {
            for (let j = exerciseTypesList.length - 1; j >= 0; j--) {
                let exercise = {
                    type: exerciseTypesList[j].type,
                    requiredBookmarks: exerciseTypesList[j].requiredBookmarks,
                    bookmarks: [],
                };
                exerciseSession.push(exercise);
            }
        }
        while (rest > 0) {
            for (let k = exerciseTypesList.length - 1; k >= 0; k--) {
                if (rest >= exerciseTypesList[k].requiredBookmarks) {
                    let exercise = {
                        type: exerciseTypesList[k].type,
                        requiredBookmarks: exerciseTypesList[k].requiredBookmarks,
                        bookmarks: [],
                    };
                    exerciseSession.push(exercise);
                    rest--;
                }
            }
        }
    }

    return exerciseSession;
}


export {defineExerciseSession, assignBookmarksToExercises, calculateExerciseSequence}