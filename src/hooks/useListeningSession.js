import { useEffect, useRef, useCallback } from "react";
import useSession from "./useSession";

const UPDATE_INTERVAL = 10000; // Update session every 10 seconds while playing

// Audio activity strategy on top of useSession: wall-clock segment
// tracking + play/pause/resume semantics. Audio playing IS the
// activity, so this hook doesn't use idle detection. lessonId doubles
// as the sessionKey — changing it (or setting it to undefined on a
// language toggle) ends the current session.
export default function useListeningSession(lessonId) {
  // Wall-clock segment tracking — the audio-specific time model.
  const segmentStartRef = useRef(null); // when the current play segment started
  const accumulatedSecondsRef = useRef(0); // total from all completed segments
  const isPlayingRef = useRef(false);
  const updateTimerRef = useRef(null);

  // Compute the live duration. Called by useSession on update/cleanup,
  // and by us when logging.
  const getCurrentDuration = useCallback(() => {
    let total = accumulatedSecondsRef.current;
    if (segmentStartRef.current) {
      total += Math.floor((Date.now() - segmentStartRef.current) / 1000);
    }
    return total;
  }, []);

  const session = useSession({
    type: "listening",
    sessionKey: lessonId,
    resourceId: lessonId,
    getCurrentDuration,
  });

  // Periodic upload while playing. Uses an imperative setInterval
  // (not a state-driven effect) so we can start/stop it from
  // start/pause/end without piggybacking on React state.
  const startUpdateTimer = useCallback(() => {
    if (updateTimerRef.current) return;
    updateTimerRef.current = setInterval(() => {
      if (session.getSessionId() && isPlayingRef.current) {
        session.upload();
      }
    }, UPDATE_INTERVAL);
  }, [session]);

  const stopUpdateTimer = useCallback(() => {
    if (updateTimerRef.current) {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = null;
    }
  }, []);

  // First play OR resume — depending on whether a session already exists.
  // Both flows go through this single entry point because the consumer
  // (LessonPlaybackView) only knows "user pressed play."
  const start = useCallback(() => {
    if (!lessonId) return;

    if (session.getSessionId()) {
      // Resume an existing session — keep accumulatedSecondsRef intact.
      segmentStartRef.current = Date.now();
      isPlayingRef.current = true;
      startUpdateTimer();
      console.log("Resumed listening session:", session.getSessionId());
      return;
    }

    // First play of this lesson — start a fresh session on the server.
    segmentStartRef.current = Date.now();
    accumulatedSecondsRef.current = 0;
    isPlayingRef.current = true;
    session.start();
    startUpdateTimer();
  }, [lessonId, session, startUpdateTimer]);

  // Pause — accumulate the current segment, stop the timer, flush progress.
  // The session id stays alive so a subsequent resume can pick up where
  // we left off.
  const pause = useCallback(() => {
    if (!isPlayingRef.current) return;

    if (segmentStartRef.current) {
      accumulatedSecondsRef.current += Math.floor((Date.now() - segmentStartRef.current) / 1000);
      segmentStartRef.current = null;
    }
    isPlayingRef.current = false;
    stopUpdateTimer();

    if (session.getSessionId()) {
      console.log(
        "Paused listening session:",
        session.getSessionId(),
        "accumulated:",
        getCurrentDuration(),
        "seconds",
      );
      session.upload();
    }
  }, [session, getCurrentDuration, stopUpdateTimer]);

  // Resume is just start() when there's already a session id.
  const resume = useCallback(() => {
    if (isPlayingRef.current) return;
    start();
  }, [start]);

  // End the session completely (audio playback finished).
  const end = useCallback(() => {
    stopUpdateTimer();
    if (segmentStartRef.current) {
      accumulatedSecondsRef.current += Math.floor((Date.now() - segmentStartRef.current) / 1000);
      segmentStartRef.current = null;
    }
    isPlayingRef.current = false;
    session.end();
  }, [session, stopUpdateTimer]);

  // Local cleanup: stop the imperative interval timer on unmount or
  // lessonId change. The session itself is closed by useSession's own
  // cleanup-on-sessionKey effect, which fires *after* this one (effect
  // cleanups run in reverse declaration order) and reads the live
  // duration via getCurrentDuration. We deliberately do NOT reset the
  // segment refs here, because useSession's cleanup needs them to
  // compute that final duration. The refs get reset on the next
  // start() instead.
  useEffect(() => {
    return () => {
      stopUpdateTimer();
    };
  }, [lessonId, stopUpdateTimer]);

  return {
    start,
    pause,
    resume,
    end,
    isPlaying: isPlayingRef.current,
    getSessionId: session.getSessionId,
  };
}
