import LocalStorage from "../../assorted/LocalStorage";

export default function daysSinceLastExercise() {
  let lastDateExercises = LocalStorage.getLastExerciseCompleteDate();
  let daysSinceExercise = null;
  if (lastDateExercises) {
    daysSinceExercise = Math.floor(
      (new Date() - new Date(lastDateExercises)) / (1000 * 60 * 60 * 24),
    );
  }
  return daysSinceExercise;
}
