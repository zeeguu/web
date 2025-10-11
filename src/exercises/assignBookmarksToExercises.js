import { removeAllMatchingItemFromList } from "../utils/basic/arrays";
import shuffle from "../assorted/fisherYatesShuffle";

function popNElementsFromList(l, n) {
  let a = [];
  for (let i = 0; i < n; i++) {
    a.push(l.shift());
  }
  return a;
}

function distinctContexts(potentialBookmarks) {
  let potentialBookmarkContexts = potentialBookmarks.map((bookmark) => bookmark.context);
  let distinctContextsCount = new Set(potentialBookmarkContexts).size;
  return distinctContextsCount === potentialBookmarkContexts.length;
}

function distinctTranslations(potentialBookmarks) {
  let potentialBookmarkContexts = potentialBookmarks.map((bookmark) => bookmark.to);
  let distinctContextsCount = new Set(potentialBookmarkContexts).size;
  return distinctContextsCount === potentialBookmarkContexts.length;
}

function groupByLevel(items) {
  return items.reduce((acc, item) => {
    const level = item.level || 1;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(item);
    return acc;
  }, {});
}

function assignBookmarks(currentBookmarks, currentExercises) {
  /* 
    Attempts to assign all currentExercises given the currentBookmarks.
    if there is no exercise for these bookmarks, assign a default one.
  
    Does all the checks that are required to ensure quality exercises
    are generated for the Extended Sequence
    
    We shuffle the list every loop to ensure variation of the sequence of exercises.
  */
  let suitableExerciseFound = false;
  let possibleExercises = [...currentExercises];
  let exerciseList = [];
  while (!suitableExerciseFound) {
    possibleExercises = shuffle(possibleExercises);
    for (let i = 0; i < possibleExercises.length; i++) {
      let selectedExerciseType = possibleExercises[i];
      let requiredBookmarks = selectedExerciseType.requiredBookmarks;
      let availableBookmarks = currentBookmarks.length;

      if (
        requiredBookmarks <= availableBookmarks &&
        distinctContexts(currentBookmarks.slice(0, requiredBookmarks)) &&
        distinctTranslations(currentBookmarks.slice(0, requiredBookmarks))
      ) {
        let testedBookmarks = popNElementsFromList(currentBookmarks, selectedExerciseType.testedBookmarks);
        // This is done to avoid sequences that are too small
        // We only remove the bookmarks we are testing, and then
        // we take the others as extra
        let bookmarksForExercise = testedBookmarks.concat(
          currentBookmarks.slice(0, requiredBookmarks - testedBookmarks.length),
        );
        let exercise = {
          type: selectedExerciseType.type,
          bookmarks: bookmarksForExercise,
        };
        exerciseList.push(exercise);
        suitableExerciseFound = true;
      }

      if (!suitableExerciseFound) {
        possibleExercises = removeAllMatchingItemFromList(selectedExerciseType, possibleExercises);
        // Fallback to default sequence if no suitable exercises are found
        if (possibleExercises.length === 0) {
          console.error("Couldn't find a sequence, resorting to default sequence.");
          return assignBookmarksToDefaultSequence(currentBookmarks, currentExercises);
        }
      }
    }
  }
  return exerciseList;
}

function assignBookmarksToLevels(bookmarks, exerciseTypesList) {
  let exerciseSequence = [];

  let bookmarksByLevel = groupByLevel(bookmarks);
  let exercisesByLevel = groupByLevel(exerciseTypesList);

  for (let level = 1; level <= 4; level++) {
    let currentBookmarks = bookmarksByLevel[level] || [];
    let currentExercises = exercisesByLevel[level] || [];

    while (currentBookmarks.length > 0 && currentExercises.length > 0) {
      let assignedExercises = assignBookmarks(currentBookmarks, currentExercises);
      exerciseSequence = exerciseSequence.concat(assignedExercises);
    }
  }

  return exerciseSequence;
}

// NOTE: This has "default sequence" in the name because it is really supposed to be only used for the default sequence; it would really
// not do a good job at assigning bookmarks to the Extended sequence, e.g. ,
// because it does not have specific checks (e.g. different contexts)
// TODO: Investigate whether this can be implemented by generalizing the assignBookmarks
// and just taking another function that is testing whether a set of bookmarks match an exercise
function assignBookmarksToDefaultSequence(bookmarks, exerciseTypesList) {
  let exerciseSequence = [];
  let exerciseType_i = 0;
  let bookmark_i = 0;

  while (bookmark_i < bookmarks.length) {
    let currExRequiredBookmarks = exerciseTypesList[exerciseType_i].requiredBookmarks;

    if (
      bookmark_i + currExRequiredBookmarks <= bookmarks.length &&
      distinctTranslations(bookmarks.slice(bookmark_i, bookmark_i + currExRequiredBookmarks))
    ) {
      let exercise = {
        type: exerciseTypesList[exerciseType_i].type,
        bookmarks: bookmarks.slice(bookmark_i, bookmark_i + currExRequiredBookmarks),
      };
      exerciseSequence.push(exercise);
      bookmark_i += currExRequiredBookmarks;
    }
    exerciseType_i++;
    if (exerciseType_i === exerciseTypesList.length) exerciseType_i = 0;
  }
  return exerciseSequence;
}

function assignBookmarksToExercises(bookmarks, exerciseTypesList) {
  return assignBookmarksToLevels(bookmarks, exerciseTypesList);
}

export { assignBookmarksToExercises };
