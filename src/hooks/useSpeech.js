import { useState, useRef, useCallback, useContext } from "react";
import { APIContext } from "../contexts/APIContext";

/**
 * Hook for text-to-speech functionality.
 * Returns { speak, stop, isSpeaking }
 */
export default function useSpeech() {
  const api = useContext(APIContext);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const speak = useCallback(async (text, languageCode) => {
    if (isSpeaking) {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    try {
      const audioUrl = await api.getSpeechAudioUrl(text, languageCode);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  }, [api, isSpeaking]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
