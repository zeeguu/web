// Saving a few user preferences from a settings page: shown at once, saved in
// the background, and undone if the save fails, but only for the keys it
// changed and only if nothing newer (another change, logging out) replaced
// them meanwhile. Each change applies to the preferences as they are when it
// lands, so two quick changes both stay.

// The preferences with `changes` applied, and what those keys were before;
// unchanged (and nothing to undo) when the preferences are not loaded.
export function applyChanges(current, changes) {
  if (!current?.daily_goal_minutes) return { next: current, previous: null };
  const previous = Object.fromEntries(Object.keys(changes).map((key) => [key, current[key]]));
  return { next: { ...current, ...changes }, previous };
}

// The preferences with a failed save undone: its keys back to `previous`,
// unless any of them was changed again since.
export function undoChanges(current, changes, previous) {
  const untouched = previous && Object.keys(changes).every((key) => current?.[key] === changes[key]);
  return untouched ? { ...current, ...previous } : current;
}

// Returns false (and sends nothing) when the preferences are not loaded, or
// the learner has logged out.
export function savePreferences({ api, preferences, setUserPreferences, changes, onSaved, onFailed }) {
  const { previous } = applyChanges(preferences, changes);
  if (!previous) return false;
  setUserPreferences((current) => applyChanges(current, changes).next);
  api.saveUserPreferences(
    changes,
    () => onSaved?.(),
    () => {
      setUserPreferences((current) => undoChanges(current, changes, previous));
      onFailed?.();
    },
  );
  return true;
}
