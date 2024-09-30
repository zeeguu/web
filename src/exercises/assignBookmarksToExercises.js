import { random } from "../utils/basic/arrays";
import {
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
} from "./exerciseSequenceTypes";
import {
  LEARNING_CYCLE_NAME,
  MEMORY_TASK,
  LEARNING_CYCLE,
} from "./ExerciseTypeConstants";

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

function getMemoryTask(bookmark) {
  let memoryTask =
    bookmark.consecutive_correct_answers >= 2 && bookmark.cooling_interval >= 2
      ? MEMORY_TASK.RECALL
      : MEMORY_TASK.RECOGNITION;

  return memoryTask;
}

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
    let memoryTask = getMemoryTask(bookmarks[i]);
    // Filter the exercises based on the learning_cycle attribute of the bookmark
    let learningCycle = LEARNING_CYCLE_NAME[bookmarks[i].learning_cycle];
    let exerciseListForCycle = exercisesByLearningCycle[learningCycle];

    let suitableExercises = exerciseListForCycle.filter(
      (exercise) => exercise.memoryTask === memoryTask,
    );

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
          i += selectedExerciseType.testedBookmarks - 1;
          suitableExerciseFound = true;
        } else {
          suitableExerciseFound = false;
        }
      }
      if (!suitableExerciseFound) {
        suitableExercises = _removeExerciseFromList(
          selectedExerciseType,
          suitableExercises,
        );
        // Fallback to default sequence if no suitable exercises are found
        if (suitableExercises.length === 0) {
          return assignBookmarksToDefaultSequence(bookmarks, exerciseTypesList);
        }
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
