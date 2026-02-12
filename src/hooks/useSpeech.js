import { useState, useRef, useContext, useCallback } from "react";
import { APIContext } from "../contexts/APIContext";

/**
 * Hook for text-to-speech functionality.
 *
 * Usage:
 *   const { speak, isSpeaking } = useSpeech();
 *   <button onClick={() => speak("hund", "da")} disabled={isSpeaking}>
 *     Listen
 *   </button>
 */
export default function useSpeech() {
  const api = useContext(APIContext);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  // Lazy init audio element
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return audioRef.current;
  }, []);

  const speak = useCallback(async (text, languageCode) => {
    if (isSpeaking || !text || !languageCode) return;

    const audio = getAudio();

    // Stop any current playback
    audio.pause();
    audio.currentTime = 0;

    setIsSpeaking(true);
    try {
      const linkToMp3 = await api.fetchLinkToSpeechMp3(text, languageCode);
      audio.src = linkToMp3;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (err) {
      console.error("Speech error:", err);
      setIsSpeaking(false);
    }
  }, [api, isSpeaking, getAudio]);

  const stop = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    audio.currentTime = 0;
    setIsSpeaking(false);
  }, [getAudio]);

  return { speak, stop, isSpeaking };
}
