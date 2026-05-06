export const SILENCE_THRESHOLD_MS = 1500;
export const MIN_VOICE_BEFORE_STOP_ELIGIBLE_MS = 120;
export const RECORDING_PREROLL_MS = 650;

const SUPPORTED_RECORDING_MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

export function supportedRecordingMimeType() {
  if (typeof window === "undefined" || !window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== "function") {
    return "";
  }

  for (const type of SUPPORTED_RECORDING_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "";
}
