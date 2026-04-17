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
