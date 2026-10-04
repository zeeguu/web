import React, { useCallback, useEffect, useState } from "react";
import { clearAudioLogs, readAudioLogs } from "./nativeAudio";

// TEMPORARY: on-device audio diagnostics (revert before merge).
// Shows the native player's log (it survives the app being killed) and the
// page's own, interleaved by time, to find out why headset play stops working
// after a long pause. Copy sends it all to the clipboard.
export default function NativeAudioDebug() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    const { native, js } = await readAudioLogs();
    setLines([...native, ...js].sort((a, b) => a.slice(0, 8).localeCompare(b.slice(0, 8))));
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    const onVisible = () => !document.hidden && refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [open, refresh]);

  const copy = async () => {
    await refresh();
    const { native, js } = await readAudioLogs();
    const text = [...native, ...js].sort((a, b) => a.slice(0, 8).localeCompare(b.slice(0, 8))).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy the audio log:", text);
    }
  };

  const clear = async () => {
    await clearAudioLogs();
    refresh();
  };

  const button = { fontSize: "12px", padding: "4px 8px", marginRight: "6px" };

  return (
    <div style={{ marginTop: "12px", fontSize: "11px", textAlign: "left" }}>
      <button style={button} onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} audio log (debug)
      </button>
      {open && (
        <>
          <button style={button} onClick={refresh}>
            Refresh
          </button>
          <button style={button} onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button style={button} onClick={clear}>
            Clear
          </button>
          <pre
            style={{
              maxHeight: "300px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              background: "var(--card-bg)",
              border: "1px solid var(--border-light)",
              padding: "6px",
              marginTop: "6px",
            }}
          >
            {lines.slice(-200).join("\n") || "(empty)"}
          </pre>
        </>
      )}
    </div>
  );
}
