export function correctnessBasedOnTries(message) {
  if (!message) return [false, false];
  const userIsCorrect = ["C", "TC", "TTC", "TTTC", "HC", "CC", "CCC"].includes(
    message,
  );
  const userIsWrong = message.includes("W") || message.includes("S");

  return [userIsCorrect, userIsWrong];
}
