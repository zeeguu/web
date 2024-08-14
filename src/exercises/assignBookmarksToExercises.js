import { random } from "../utils/basic/arrays";
import {
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
} from "./exerciseSequenceTypes";
import { LEARNING_CYCLE_NAME } from "./ExerciseTypeConstants";

/**
 * The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
 * with the required amount of bookmarks assigned to each exercise and the first set of bookmarks set as
 * currentBookmarksToStudy to begin the exercise session.
 */
function getExerciseListByLearningCycle(exerciseList) {
  let exerciseByLearningCycle = {};
  for (let i = 0; i < exerciseList.length; i++) {
    let exercise = exerciseList[i];
    if (!exerciseByLearningCycle[exercise.learningCycle]) {
      exerciseByLearningCycle[exercise.learningCycle] = [];
    }
    exerciseByLearningCycle[exercise.learningCycle].push(exercise);
  }
  return exerciseByLearningCycle;
}

// It is important that there are exercises requiring only one bookmark for each cateogry (i.e. receptive/productive learning cycle and recall/recognition cognitive focus)
function assignBookmarksWithLearningCycle(bookmarks, exerciseTypesList) {
  function _removeExerciseFromList(exercise, list) {
    return list.filter((ex) => ex !== exercise);
  }

  function _distinctContexts(potentialBookmarks) {
    let potentialBookmarkContexts = potentialBookmarks.map(
      (bookmark) => bookmark.context,
    );
    let distinctContextsCount = new Set(potentialBookmarkContexts).size;
    return distinctContextsCount === potentialBookmarkContexts.length;
  }

  let exerciseSequence = [];

  let exercisesByLearningCycle =
    getExerciseListByLearningCycle(exerciseTypesList);

  for (let i = 0; i < bookmarks.length; i++) {
    let cognitiveFocus =
      bookmarks[i].consecutive_correct_answers >= 2 &&
      bookmarks[i].cooling_interval >= 2
        ? "recall"
        : "recognition";

    // Filter the exercises based on the learning_cycle attribute of the bookmark
    let learningCycle = LEARNING_CYCLE_NAME[bookmarks[i].learning_cycle];
    let exerciseListForCycle = exercisesByLearningCycle[learningCycle];

    let suitableExercises = exerciseListForCycle.filter(
      (exercise) => exercise.cognitiveFocus === cognitiveFocus,
    );

    console.log(suitableExercises);
    console.log(bookmarks[i]);

    let suitableExerciseFound = false;
    while (!suitableExerciseFound) {
      let selectedExerciseType = random(suitableExercises);

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
        exerciseListForCycle = _removeExerciseFromList(
          selectedExerciseType,
          exerciseListForCycle,
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
