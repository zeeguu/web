const ExerciseNotifications = class {
  constructor(api) {
    this.hasExercises = null;
    this.exerciseCounter = null;
    this.setHasExercisesHook = undefined;
    this.setExerciseCounterHook = undefined;
    this.api = api;
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
    if (this.setExerciseCounterHook) this.setExerciseCounterHook(this.exerciseCounter);
  }

  fetchAndUpdate() {
    this.api.getBookmarksToStudyCount((scheduledBookmarksCount) => {
      this.setHasExercises(scheduledBookmarksCount > 0);
      this.setExerciseCounter(scheduledBookmarksCount);
      console.log("before updating state");
      this.updateReactState();
    });
  }
};

export default ExerciseNotifications;
