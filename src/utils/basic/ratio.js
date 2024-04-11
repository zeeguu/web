export default function ratio(val, max = 100) {
  return Math.round((val / max) * 100) / 100;
}
