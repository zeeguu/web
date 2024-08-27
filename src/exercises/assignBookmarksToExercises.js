import { random } from "../utils/basic/arrays";
import {
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
} from "./exerciseSequenceTypes";
import { LEARNING_CYCLE_NAME, MEMORY_TASK } from "./ExerciseTypeConstants";

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

  function filterBookmarksInDifferentCycle(
    bookmarkList,
    bookmarkLearningCycle,
  ) {
    return [...bookmarkList].filter(
      (each) => each.learning_cycle === bookmarkLearningCycle,
    );
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

  // Create a copy of bookmarks to assign them to exercises
  // This list should be empty at the end.
  let bookmarksToAssign = [...bookmarks];

  while (bookmarksToAssign.length > 0) {
    // Pop the first element of the bookmark list
    let currentBookmark = bookmarksToAssign.shift();
    let memoryTask = getMemoryTask(currentBookmark);
    // Filter the exercises based on the learning_cycle attribute of the bookmark
    let learningCycle = LEARNING_CYCLE_NAME[currentBookmark.learning_cycle];
    let exerciseListForCycle = exercisesByLearningCycle[learningCycle];

    let suitableExercises = exerciseListForCycle.filter(
      (exercise) => exercise.memoryTask === memoryTask,
    );

    let suitableExerciseFound = false;
    while (!suitableExerciseFound) {
      let selectedExerciseType = random(suitableExercises);
      // If the exercise requires multiple bookmarks
      if (selectedExerciseType.requiredBookmarks > 1) {
        // Get bookmarks in the same cycle
        let potentialBookmarks = filterBookmarksInDifferentCycle(
          bookmarksToAssign,
          currentBookmark.learning_cycle,
        );
        // Re-add the current bookmark (we assume that is the first element, followed by the rest)
        potentialBookmarks.unshift(currentBookmark);
        // We take the elements corresponding to the required bookmarks by the exercise
        let currentBWithPotentialBookmarks = potentialBookmarks.slice(
          0,
          selectedExerciseType.requiredBookmarks,
        );
        // This can only be true if we found enough bookmarks after filtering
        let hasEnoughBookmarks =
          currentBWithPotentialBookmarks.length ===
          selectedExerciseType.requiredBookmarks;
        if (
          hasEnoughBookmarks &&
          _distinctContexts(currentBWithPotentialBookmarks)
        ) {
          // If the bookmarks are distinct and there is enough of them we can add
          // exercise.
          // NOTE: We could make distinctExercises filter from the potentialBookmarks
          // this would a bit smarter than just taking the first n required bookmarks.
          let exercise = {
            type: selectedExerciseType.type,
            bookmarks: currentBWithPotentialBookmarks,
          };
          exerciseSequence.push(exercise);
          suitableExerciseFound = true;
          // We have found an exercise! We still need to remove from the list
          // all the bookmarks we have used.
          for (let i = 0; i < currentBWithPotentialBookmarks.length; i++) {
            let bookmarkIndex = bookmarksToAssign.indexOf(
              currentBWithPotentialBookmarks[i],
            );
            // If the bookmark we used is in the bookmarsToAssign list,
            // we remove it from the list. indexOf return -1 if the element isn't present.
            if (bookmarkIndex !== -1)
              bookmarksToAssign.splice(bookmarkIndex, 1);
          }
        }
      } else {
        // If the exercise only requires one bookmark, we can add it immediately.
        let exercise = {
          type: selectedExerciseType.type,
          bookmarks: [currentBookmark],
        };
        exerciseSequence.push(exercise);
        suitableExerciseFound = true;
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
