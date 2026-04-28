// daily_audio_status values used in UserContext
export const AUDIO_STATUS = {
  GENERATING: "generating",
  READY: "ready",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

// Generation progress statuses from the backend
export const GENERATION_PROGRESS = {
  DONE: "done",
  ERROR: "error",
  // Only phase that emits a moving sub-step counter (current_step /
  // total_steps); the others ("pending", "generating_script",
  // "combining_audio") sit on a static message for many seconds, so we
  // rotate placeholders during them.
  SYNTHESIZING_AUDIO: "synthesizing_audio",
};
