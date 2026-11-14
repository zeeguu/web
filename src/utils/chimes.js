// Synthesized UI feedback sounds — no asset files, just WebAudio sine waves.
// Keep them short and quiet; they confirm input rather than celebrate it
// (streak chime is the one exception, since it marks a rarer event).

let ctx;
function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function blip({ type = "sine", from, ramp, peak = 0.2, duration }) {
  const c = getCtx();
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  for (const [freq, offset] of ramp) {
    osc.frequency.exponentialRampToValueAtTime(freq, now + offset);
  }
  const total = duration ?? ramp[ramp.length - 1][1];
  gain.gain.setValueAtTime(peak, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + total);
  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + total);
}

export function playStreakChime() {
  blip({ from: 300, ramp: [[900, 0.08], [600, 0.15]], peak: 0.2, duration: 0.2 });
}

export function playTapChime() {
  blip({ from: 700, ramp: [[500, 0.08]], peak: 0.05 });
}

// A sine note starting `at` seconds from now, fading out over `duration`.
function note(freq, at, duration = 0.18, peak = 0.08) {
  const c = getCtx();
  const start = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration);
}

// Two quick rising notes (C6, E6): an answer was taken.
export function playHappyChime() {
  try {
    note(1047, 0);
    note(1319, 0.07);
  } catch {
    // No audio (e.g. AudioContext unavailable): the tap still counts.
  }
}

// Three rising notes (C6, E6, G6): all the questions are answered.
export function playDoneChime() {
  try {
    note(1047, 0);
    note(1319, 0.08);
    note(1568, 0.16, 0.3);
  } catch {
    // No audio: nothing to do.
  }
}
