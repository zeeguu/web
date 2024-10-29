import LocalStorage from "../../assorted/LocalStorage";

function daysSinceLastExercise() {
  let lastDateExercises = LocalStorage.getLastExerciseCompleteDate();
  let daysSinceExercise = null;
  if (lastDateExercises) {
    daysSinceExercise = Math.floor(
      (new Date() - new Date(lastDateExercises)) / (1000 * 60 * 60 * 24),
    );
  }
  return daysSinceExercise;
}

function userHasNotExercisedToday() {
  // The user hasn't been to exercises yet, or it's more than one day since
  // they have been to exercises

  let daysSinceExercise = daysSinceLastExercise();
  return daysSinceExercise === null || daysSinceExercise >= 1;
}

export { daysSinceLastExercise, userHasNotExercisedToday };
