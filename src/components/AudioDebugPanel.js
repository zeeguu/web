import { useEffect, useState } from "react";
import { audioDebugEnabled, readAudioDebug, clearAudioDebug } from "./audioDebug";

// TEMPORARY: shows the audioDebug log under the player (see audioDebug.js).
export default function AudioDebugPanel() {
  const [entries, setEntries] = useState(readAudioDebug);
  useEffect(() => {
    const refresh = () => setEntries(readAudioDebug());
    window.addEventListener("audio-debug", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("audio-debug", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  if (!audioDebugEnabled()) return null;
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "8px",
        border: "1px dashed var(--border-color)",
        fontFamily: "monospace",
        fontSize: "11px",
        color: "var(--text-primary)",
        maxHeight: "260px",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <b>audio debug ({entries.length})</b>
        <button type="button" onClick={clearAudioDebug}>
          clear
        </button>
      </div>
      {entries
        .slice()
        .reverse()
        .map((e, i) => (
          <div key={i}>{e}</div>
        ))}
    </div>
  );
}
