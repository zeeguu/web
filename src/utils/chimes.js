// Synthesized UI feedback sounds — no asset files, just WebAudio sine waves.
// Keep them short and quiet; they confirm input rather than celebrate it
// (streak chime is the one exception, since it marks a rarer event).

let ctx;
function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function blip({ type = "sine", from, to, peak = 0.2, duration = 0.2 }) {
  const c = getCtx();
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  if (Array.isArray(to)) {
    let t = now;
    for (const [freq, offset] of to) {
      t = now + offset;
      osc.frequency.exponentialRampToValueAtTime(freq, t);
    }
  } else {
    osc.frequency.exponentialRampToValueAtTime(to, now + duration);
  }
  gain.gain.setValueAtTime(peak, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + duration);
}

// Triumphant up-then-settle for daily streak increases.
export function playStreakChime() {
  blip({ from: 300, to: [[900, 0.08], [600, 0.15]], peak: 0.2, duration: 0.2 });
}

// Softer positive note for correct exercise / positive feedback.
export function playCorrectChime() {
  blip({ from: 500, to: 900, peak: 0.12, duration: 0.15 });
}

// Very quiet neutral confirmation for feedback button taps.
export function playTapChime() {
  blip({ from: 700, to: 500, peak: 0.05, duration: 0.08 });
}

// Back-compat default export — retained while callers migrate.
export default playStreakChime;
