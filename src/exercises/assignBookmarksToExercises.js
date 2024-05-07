import { random } from "../utils/basic/arrays";
import {
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
} from "./exerciseSequenceTypes";
import { learningCycleEnum } from "./ExerciseTypeConstants";

/**
 * The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
 * with the required amount of bookmarks assigned to each exercise and the first set of bookmarks set as
 * currentBookmarksToStudy to begin the exercise session.
 */
function getExerciseListByType(exerciseList) {
  let exerciseByType = {};
  for (let i = 0; i < exerciseList.length; i++) {
    let exercise = exerciseList[i];
    if (!exerciseByType[exercise.learningCycle]) {
      exerciseByType[exercise.learningCycle] = [];
    }
    exerciseByType[exercise.learningCycle].push(exercise);
  }
  return exerciseByType;
}

function assignBookmarksWithLearningCycle(bookmarks, exerciseTypesList) {
  function _removeExerciseFromList(exercise, list) {
    list.filter((ex) => ex !== exercise);
  }

  function _distinctContexts(potentialBookmarks) {
    let potentialBookmarkContexts = potentialBookmarks.map(
      (bookmark) => bookmark.context,
    );
    let distinctContextsCount = new Set(potentialBookmarkContexts).size;
    return distinctContextsCount === potentialBookmarkContexts.length;
  }

  let exerciseSequence = [];

  let exercisesByType = getExerciseListByType(exerciseTypesList);

  for (let i = 0; i < bookmarks.length; i++) {
    // Filter the exercises based on the learning_cycle attribute of the bookmark
    let possibleExercisesTypes =
      exercisesByType[learningCycleEnum[bookmarks[i].learning_cycle]];

    let suitableExerciseFound = false;
    while (!suitableExerciseFound) {
      let selectedExerciseType = random(possibleExercisesTypes);

      // Check if there are enough bookmarks for the selected exercise
      if (i + selectedExerciseType.requiredBookmarks <= bookmarks.length) {
        let potentialBookmarks = bookmarks.slice(
          i,
          i + selectedExerciseType.requiredBookmarks,
        );

        if (_distinctContexts(potentialBookmarks)) {
          let exercise = {
            type: selectedExerciseType.type,
            bookmarks: potentialBookmarks,
          };
          exerciseSequence.push(exercise);

          // Skip the assigned bookmarks
          i += selectedExerciseType.requiredBookmarks - 1;
          suitableExerciseFound = true;
        } else {
          suitableExerciseFound = false;
        }
      }
      if (!suitableExerciseFound) {
        possibleExercisesTypes = _removeExerciseFromList(
          selectedExerciseType,
          possibleExercisesTypes,
        );
      }
    }
  }
  return exerciseSequence;
}

function assignBookmarksToDefaultSequence(bookmarks, exerciseTypesList) {
  let exerciseSequence = [];
  let exerciseType_i = 0;
  let bookmark_i = 0;

  while (bookmark_i < bookmarks.length) {
    let currExRequiredBookmarks =
      exerciseTypesList[exerciseType_i].requiredBookmarks;

    if (bookmark_i + currExRequiredBookmarks <= bookmarks.length) {
      let exercise = {
        type: exerciseTypesList[exerciseType_i].type,
        bookmarks: bookmarks.slice(
          bookmark_i,
          bookmark_i + currExRequiredBookmarks,
        ),
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
  console.log("about to test:");
  console.log(bookmarks);

  const learningCycleSequence =
    exerciseTypesList === LEARNING_CYCLE_SEQUENCE ||
    exerciseTypesList === LEARNING_CYCLE_SEQUENCE_NO_AUDIO;

  if (learningCycleSequence) {
    return assignBookmarksWithLearningCycle(bookmarks, exerciseTypesList);
  } else {
    return assignBookmarksToDefaultSequence(bookmarks, exerciseTypesList);
  }
}

export { assignBookmarksToExercises };
