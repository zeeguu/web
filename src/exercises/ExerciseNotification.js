const ExerciseNotifications = class {
  constructor() {
    this.hasExercises = null;
    this.exerciseCounter = null;
    this.setHasExercisesHook = undefined;
    this.setExerciseCounterHook = undefined;
  }
  setHasExercises(hasExercises) {
    this.hasExercises = hasExercises;
  }

  getHasExercises() {
    return this.hasExercises;
  }

  getExerciseCounter() {
    return this.exerciseCounter;
  }

  setExerciseCounter(exerciseCount) {
    this.exerciseCounter = exerciseCount;
  }

  unsetExerciseCounter() {
    this.exerciseCounter = null;
  }

  incrementExerciseCounter() {
    this.exerciseCounter++;
    if (!this.hasExercises) this.hasExercises = true;
  }

  decrementExerciseCounter() {
    if (this.exerciseCounter > 0) this.exerciseCounter--;
    if (this.exerciseCounter === 0) this.hasExercises = false;
  }

  updateReactState() {
    if (this.setHasExercisesHook) this.setHasExercisesHook(this.hasExercises);
    if (this.setExerciseCounterHook)
      this.setExerciseCounterHook(this.exerciseCounter);
  }
};

export default ExerciseNotifications;
