// TEMPORARY diagnostics for "headset play doesn't resume in the home-screen app".
// On in Netlify deploy previews; elsewhere only after opening a page with
// ?audiodebug=1 (it sticks until ?audiodebug=0). Entries survive the page being suspended or reloaded, so they
// can be read after unlocking the phone.
const FLAG = "audio_debug";
const LOG = "audio_debug_log";

export function audioDebugEnabled() {
  try {
    // Always on in Netlify deploy previews: a home-screen app ignores the URL's
    // query and has its own storage, so the flag can't be set from Safari.
    if (window.location.hostname.endsWith(".netlify.app")) return true;
    const param = new URLSearchParams(window.location.search).get("audiodebug");
    if (param === "1") localStorage.setItem(FLAG, "1");
    if (param === "0") localStorage.removeItem(FLAG);
    return localStorage.getItem(FLAG) === "1";
  } catch {
    return false;
  }
}

export function audioDebug(message) {
  if (!audioDebugEnabled()) return;
  try {
    const entries = JSON.parse(localStorage.getItem(LOG) || "[]");
    const t = new Date().toISOString().slice(11, 23);
    entries.push(`${t} ${document.hidden ? "[bg]" : "[fg]"} ${message}`);
    localStorage.setItem(LOG, JSON.stringify(entries.slice(-80)));
    window.dispatchEvent(new Event("audio-debug"));
  } catch {
    // diagnostics must never break playback
  }
}

export function readAudioDebug() {
  try {
    return JSON.parse(localStorage.getItem(LOG) || "[]");
  } catch {
    return [];
  }
}

export function clearAudioDebug() {
  localStorage.removeItem(LOG);
  window.dispatchEvent(new Event("audio-debug"));
}
