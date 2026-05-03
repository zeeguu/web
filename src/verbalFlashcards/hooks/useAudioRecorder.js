import { useCallback, useEffect, useRef, useState } from "react";
import strings from "../../i18n/definitions";
import {
  MIN_VOICE_BEFORE_STOP_ELIGIBLE_MS,
  RECORDING_PREROLL_MS,
  SILENCE_THRESHOLD_MS,
  supportedRecordingMimeType,
} from "../verbalFlashcardsLanguage";

const AUDIO_RECORDING_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

export default function useAudioRecorder({
  canContinueFlow,
  flowRunIdRef,
  isCooldownRef,
  noiseSensitivity,
  onRecordingComplete,
  updateStatusWithDebounce,
}) {
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  const isRecordingRef = useRef(false);
  const isStartingRecordingRef = useRef(false);
  const shouldProcessRecordingOnStopRef = useRef(false);
  const microphonePreparationPromiseRef = useRef(null);
  const microphonePreparationTokenRef = useRef(0);

  const lastVoiceDetectedAtRef = useRef(0);
  const voiceStartedAtRef = useRef(0);
  const recordingStartedAtRef = useRef(0);
  const recordingStopEligibleAtRef = useRef(0);
  const noiseSensitivityRef = useRef(noiseSensitivity);

  useEffect(() => {
    noiseSensitivityRef.current = noiseSensitivity;
  }, [noiseSensitivity]);

  const cleanupRecordingResources = useCallback(() => {
    microphonePreparationTokenRef.current += 1;
    microphonePreparationPromiseRef.current = null;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      shouldProcessRecordingOnStopRef.current = false;
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }

    mediaRecorderRef.current = null;

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.warn);
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    dataArrayRef.current = null;
    audioChunksRef.current = [];
    voiceStartedAtRef.current = 0;
    lastVoiceDetectedAtRef.current = 0;
    recordingStartedAtRef.current = 0;
    recordingStopEligibleAtRef.current = 0;
    shouldProcessRecordingOnStopRef.current = false;
    isStartingRecordingRef.current = false;
    isRecordingRef.current = false;
    setIsRecording(false);
  }, []);

  const prepareMicrophone = useCallback(
    async ({ showStatus = false } = {}) => {
      if (micStreamRef.current && micStreamRef.current.active) {
        return micStreamRef.current;
      }

      if (microphonePreparationPromiseRef.current) {
        return microphonePreparationPromiseRef.current;
      }

      if (showStatus) {
        updateStatusWithDebounce(strings.verbalFlashcardsPreparingMicrophone, "processing", 0);
      }

      const preparationToken = microphonePreparationTokenRef.current;
      microphonePreparationPromiseRef.current = navigator.mediaDevices
        .getUserMedia(AUDIO_RECORDING_CONSTRAINTS)
        .then((stream) => {
          if (preparationToken !== microphonePreparationTokenRef.current) {
            stream.getTracks().forEach((track) => track.stop());
            return null;
          }

          micStreamRef.current = stream;
          return stream;
        })
        .catch((error) => {
          console.error("Microphone preparation error:", error);
          updateStatusWithDebounce(strings.verbalFlashcardsMicrophonePermissionNeeded, "error");
          throw error;
        })
        .finally(() => {
          microphonePreparationPromiseRef.current = null;
        });

      return microphonePreparationPromiseRef.current;
    },
    [updateStatusWithDebounce],
  );

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state === "recording") {
      shouldProcessRecordingOnStopRef.current = true;
      try {
        recorder.stop();
      } catch (e) {
        console.warn(e);
      }
    }

    isRecordingRef.current = false;
    setIsRecording(false);
    isStartingRecordingRef.current = false;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    updateStatusWithDebounce(strings.verbalFlashcardsProcessing, "processing", 0);
  }, [updateStatusWithDebounce]);

  const setupSilenceDetection = useCallback(() => {
    if (!micStreamRef.current) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      const source = audioContext.createMediaStreamSource(micStreamRef.current);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const detect = () => {
        if (!isRecordingRef.current || !analyserRef.current || !dataArrayRef.current) {
          return;
        }

        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

        let sumSquares = 0;
        let maxSample = 0;

        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const v = (dataArrayRef.current[i] - 128) / 128;
          const abs = Math.abs(v);
          if (abs > maxSample) maxSample = abs;
          sumSquares += v * v;
        }

        const rms = Math.sqrt(sumSquares / dataArrayRef.current.length);
        const threshold = parseFloat(noiseSensitivityRef.current);
        const isVoiceFrame = maxSample > threshold || rms > threshold;
        const now = Date.now();
        const isPreroll = now < recordingStopEligibleAtRef.current;

        if (isVoiceFrame) {
          lastVoiceDetectedAtRef.current = now;

          if (!voiceStartedAtRef.current) {
            voiceStartedAtRef.current = now;
          }

          if (isPreroll) {
            updateStatusWithDebounce(strings.verbalFlashcardsPreparingMicrophone, "processing", 0);
          } else {
            updateStatusWithDebounce(strings.verbalFlashcardsRecordingSpeakNow, "recording", 0);
          }
        } else {
          const voicedFor = voiceStartedAtRef.current > 0 ? now - voiceStartedAtRef.current : 0;

          const silenceDuration =
            lastVoiceDetectedAtRef.current > 0
              ? now - lastVoiceDetectedAtRef.current
              : now - recordingStartedAtRef.current;

          if (
            !isPreroll &&
            voicedFor >= MIN_VOICE_BEFORE_STOP_ELIGIBLE_MS &&
            silenceDuration >= SILENCE_THRESHOLD_MS
          ) {
            stopRecording();
            return;
          }

          if (isPreroll) {
            updateStatusWithDebounce(strings.verbalFlashcardsPreparingMicrophone, "processing", 0);
          } else if (voiceStartedAtRef.current > 0) {
            updateStatusWithDebounce(strings.verbalFlashcardsWaitingForSpeech, "processing", 0);
          } else {
            updateStatusWithDebounce(strings.verbalFlashcardsStartingMicrophone, "recording", 0);
          }
        }

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(console.warn);
      }

      detect();
    } catch (error) {
      console.error("Silence detection setup error:", error);
      updateStatusWithDebounce(strings.verbalFlashcardsMicAnalysisError, "error");
    }
  }, [stopRecording, updateStatusWithDebounce]);

  const handleRecordingStop = useCallback(() => {
    const flowRunId = flowRunIdRef.current;

    if (!canContinueFlow(flowRunId)) {
      cleanupRecordingResources();
      return;
    }

    if (!shouldProcessRecordingOnStopRef.current) {
      cleanupRecordingResources();
      updateStatusWithDebounce(strings.verbalFlashcardsRecordingCancelled, "idle", 0);
      return;
    }

    if (!audioChunksRef.current.length) {
      updateStatusWithDebounce(strings.verbalFlashcardsNoAudioDetected, "error");
      cleanupRecordingResources();
      return;
    }

    const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    updateStatusWithDebounce(strings.verbalFlashcardsProcessing, "processing", 0);
    onRecordingComplete({
      audioBlob,
      flowRunId,
      recordingStartedAt: recordingStartedAtRef.current,
    });
  }, [canContinueFlow, cleanupRecordingResources, flowRunIdRef, onRecordingComplete, updateStatusWithDebounce]);

  const openMicAndStartRecording = useCallback(async () => {
    if (isStartingRecordingRef.current || isRecordingRef.current) return;
    if (isCooldownRef.current) return;

    try {
      isStartingRecordingRef.current = true;

      const stream = await prepareMicrophone({ showStatus: true });

      if (!stream) {
        isStartingRecordingRef.current = false;
        return;
      }

      if (isCooldownRef.current) {
        isStartingRecordingRef.current = false;
        return;
      }

      const mimeType = supportedRecordingMimeType();
      mediaRecorderRef.current = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = handleRecordingStop;
      shouldProcessRecordingOnStopRef.current = true;

      recordingStartedAtRef.current = Date.now();
      recordingStopEligibleAtRef.current = recordingStartedAtRef.current + RECORDING_PREROLL_MS;
      lastVoiceDetectedAtRef.current = 0;
      voiceStartedAtRef.current = 0;

      mediaRecorderRef.current.start();

      isRecordingRef.current = true;
      setIsRecording(true);
      isStartingRecordingRef.current = false;

      updateStatusWithDebounce(strings.verbalFlashcardsPreparingMicrophone, "processing", 0);
      setupSilenceDetection();
    } catch (error) {
      console.error("Recording start error:", error);
      isStartingRecordingRef.current = false;
      isRecordingRef.current = false;
      setIsRecording(false);
      updateStatusWithDebounce(strings.verbalFlashcardsMicrophonePermissionNeeded, "error");
      cleanupRecordingResources();
    }
  }, [
    cleanupRecordingResources,
    handleRecordingStop,
    isCooldownRef,
    prepareMicrophone,
    setupSilenceDetection,
    updateStatusWithDebounce,
  ]);

  return {
    cleanupRecordingResources,
    isRecording,
    isRecordingRef,
    isStartingRecordingRef,
    micStreamRef,
    openMicAndStartRecording,
    prepareMicrophone,
    recordingStartedAtRef,
  };
}
