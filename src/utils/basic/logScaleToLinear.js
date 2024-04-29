// maps the cooling interval values (0, 1, 2, 4, 8) to a linear sequence (0, 1, 2, 3, 4)
export function logScaleToLinear(coolingInterval) {
  return Math.round(Math.log2(coolingInterval * 2 + 1));
}
