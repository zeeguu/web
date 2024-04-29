import { random } from "../utils/basic/arrays";
import {
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
} from "./exerciseSequenceTypes";

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
  const learningCycleEnum = Object.freeze({
    0: "not set",
    1: "receptive",
    2: "productive",
  });

  let exerciseSequence = [];
  let exercisesByType = getExerciseListByType(exerciseTypesList);
  for (let i = 0; i < bookmarks.length; i++) {
    // Filter the exercises based on the learning_cycle attribute of the bookmark
    let filteredExercises =
      exercisesByType[learningCycleEnum[bookmarks[i].learning_cycle]];

    let suitableExerciseFound = false;
    while (!suitableExerciseFound) {
      let selectedExercise = random(filteredExercises);

      // Check if there are enough bookmarks for the selected exercise
      if (i + selectedExercise.requiredBookmarks <= bookmarks.length) {
        let exercise = {
          type: selectedExercise.type,
          bookmarks: bookmarks.slice(i, i + selectedExercise.requiredBookmarks),
        };
        exerciseSequence.push(exercise);

        // Skip the assigned bookmarks
        i += selectedExercise.requiredBookmarks - 1;
        suitableExerciseFound = true;
      } else {
        filteredExercises = filteredExercises.filter(
          (exercise) => exercise !== selectedExercise,
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
