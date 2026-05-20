// Wait-time vocab drill cache (see ../components/WaitDrill.js).
//
// Per-language ring buffer of {o, t, src, ts} pairs stored in localStorage.
// Filled opportunistically from three sources, tagged by `src`:
//   - "exercise"    completed exercises (highest signal — deliberate study)
//   - "scheduled"   one-shot startup seed from the scheduled-words endpoint
//   - "translation" in-reader word taps
// Bounded so a chatty session can't bloat localStorage; oldest evicted.
// Dedup on the origin word so a later higher-signal source supersedes an
// earlier translation tap.

const STORAGE_KEY = "drill_vocab_cache";
const MAX_PER_LANG = 500;

// Module-scope mirror of the parsed cache. Translation taps in the reader
// can fire pushDrillVocab dozens of times in a session; without this each
// call would JSON.parse + JSON.stringify the full ~60KB blob. Single-tab
// assumption (no `storage` event listener) is implicit elsewhere in the
// app already.
let cached = null;

function readAll() {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cached = raw ? JSON.parse(raw) : {};
  } catch {
    cached = {};
  }
  return cached;
}

export function getDrillVocab(lang) {
  if (!lang) return [];
  const all = readAll();
  return Array.isArray(all[lang]) ? all[lang] : [];
}

export function isDrillVocabEmpty(lang) {
  return getDrillVocab(lang).length === 0;
}

export function pushDrillVocab(lang, pairs, src) {
  if (!lang || !Array.isArray(pairs) || pairs.length === 0) return;
  const all = readAll();
  const existing = Array.isArray(all[lang]) ? all[lang] : [];
  const byOrigin = new Map(existing.map((e) => [e.o, e]));
  const now = Date.now();
  for (const p of pairs) {
    const o = (p?.o ?? "").trim();
    const t = (p?.t ?? "").trim();
    if (!o || !t) continue;
    byOrigin.set(o, { o, t, src, ts: now });
  }
  let next = Array.from(byOrigin.values());
  if (next.length > MAX_PER_LANG) {
    next.sort((a, b) => b.ts - a.ts);
    next = next.slice(0, MAX_PER_LANG);
  }
  all[lang] = next;
  cached = all;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn("Drill cache write failed, dropping cache:", e);
    cached = {};
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }
}

export function clearDrillVocab() {
  cached = {};
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
