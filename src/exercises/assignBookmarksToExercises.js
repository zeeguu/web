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
const EX_TYPE_SEQUENCE = [
  [LEARNING_CYCLE.RECEPTIVE, MEMORY_TASK.RECOGNITION],
  [LEARNING_CYCLE.PRODUCTIVE, MEMORY_TASK.RECOGNITION],
  [LEARNING_CYCLE.RECEPTIVE, MEMORY_TASK.RECALL],
  [LEARNING_CYCLE.PRODUCTIVE, MEMORY_TASK.RECALL],
];

function getMemoryTask(bookmark) {
  let memoryTask =
    bookmark.cooling_interval > 2
      ? MEMORY_TASK.RECALL
      : MEMORY_TASK.RECOGNITION;
  return memoryTask;
}
function getBookmarkCycleTaskKey(b) {
  // If there is no learning cycle (it is a new word) treat as
  // receptive.
  return [
    b.learning_cycle === LEARNING_CYCLE.NOT_SET
      ? LEARNING_CYCLE.RECEPTIVE
      : b.learning_cycle,
    getMemoryTask(b),
  ];
}

function getExerciseCycleTaskKey(e) {
  let learningCycleKey =
    e.learningCycle === "receptive"
      ? LEARNING_CYCLE.RECEPTIVE
      : LEARNING_CYCLE.PRODUCTIVE;
  return [learningCycleKey, e.memoryTask];
}

function getElementsByCycleTask(elementList, keyFunc) {
  let elementsByCycleTask = {};
  for (let i = 0; i < elementList.length; i++) {
    let e = elementList[i];
    let eKey = keyFunc(e);
    if (!elementsByCycleTask[eKey]) {
      elementsByCycleTask[eKey] = [];
    }
    elementsByCycleTask[eKey].push(e);
  }
  return elementsByCycleTask;
}

function popNElementsFromList(l, n) {
  let a = [];
  for (let i = 0; i < n; i++) {
    a.push(l.shift());
  }
  return a;
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

  function _distinctTranslations(potentialBookmarks) {
    let potentialBookmarkContexts = potentialBookmarks.map(
      (bookmark) => bookmark.to,
    );
    let distinctContextsCount = new Set(potentialBookmarkContexts).size;
    return distinctContextsCount === potentialBookmarkContexts.length;
  }

  let exerciseSequence = [];

  let exercisesByCycleTask = getElementsByCycleTask(
    exerciseTypesList,
    getExerciseCycleTaskKey,
  );
  let bookmarksByCycleTask = getElementsByCycleTask(
    bookmarks,
    getBookmarkCycleTaskKey,
  );

  for (let i = 0; i < EX_TYPE_SEQUENCE.length; i++) {
    let currentCycleTask = EX_TYPE_SEQUENCE[i];
    // Check if we have exercises for the the sequence type
    if (bookmarksByCycleTask[currentCycleTask]) {
      // Assign the bookmarks to a random exercise if possible
      let currentBookmarkList = bookmarksByCycleTask[currentCycleTask];
      while (currentBookmarkList.length > 0) {
        // We have to unpack, because we alter the list if the exercise
        // can't be done with the number of bookmarks we have.
        let possibleExercises = [...exercisesByCycleTask[currentCycleTask]];
        let suitableExerciseFound = false;
        while (!suitableExerciseFound) {
          let selectedExerciseType = random(possibleExercises);
          let requiredBookmarks = selectedExerciseType.requiredBookmarks;
          let availableBookmarks = currentBookmarkList.length;
          if (
            requiredBookmarks <= availableBookmarks &&
            _distinctContexts(
              currentBookmarkList.slice(0, requiredBookmarks),
            ) &&
            _distinctTranslations(
              currentBookmarkList.slice(0, requiredBookmarks),
            )
          ) {
            let testedBookmarks = popNElementsFromList(
              currentBookmarkList,
              selectedExerciseType.testedBookmarks,
            );
            // This is done to avoid sequences that are too small
            // We only remove the bookmarks we are testing, and then
            // we take the others as extra
            let bookmarksForExercise = testedBookmarks.concat(
              currentBookmarkList.slice(
                0,
                requiredBookmarks - testedBookmarks.length,
              ),
            );
            let exercise = {
              type: selectedExerciseType.type,
              bookmarks: bookmarksForExercise,
            };
            exerciseSequence.push(exercise);
            suitableExerciseFound = true;
          }
          if (!suitableExerciseFound) {
            possibleExercises = _removeExerciseFromList(
              selectedExerciseType,
              possibleExercises,
            );
            // Fallback to default sequence if no suitable exercises are found
            if (possibleExercises.length === 0) {
              console.log("FALLING BACK!");
              return assignBookmarksToDefaultSequence(
                bookmarks,
                exerciseTypesList,
              );
            }
          }
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
