// The API can switch off an exercise type that turns out to be broken, for the
// time a fix spends in app review. Worth no more than this short wait, and
// never worth a session: on a failure nothing is disabled.
const WAIT_MS = 1500;

export function fetchDisabledExerciseTypes(api, waitMs = WAIT_MS) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), waitMs);
    try {
      api.getDisabledExerciseTypes(
        (types) => resolve(Array.isArray(types) ? types : []),
        () => resolve([]),
      );
    } catch {
      resolve([]);
    }
  });
}

// A disabled type stays if nothing else at its level can take a single word:
// the last word or two of a level would otherwise have no exercise, and would
// silently drop out of the session.
export function withoutDisabledTypes(sequence, disabledTypes) {
  const isDisabled = (exercise) => disabledTypes.includes(exercise.exerciseType);
  const hasSingleWordAlternative = (exercise) =>
    sequence.some((other) => other.level === exercise.level && !isDisabled(other) && other.requiredBookmarks === 1);

  return sequence.filter((exercise) => !isDisabled(exercise) || !hasSingleWordAlternative(exercise));
}
