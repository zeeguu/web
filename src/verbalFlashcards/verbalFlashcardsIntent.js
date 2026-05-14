const REVEAL_ANSWER_TOKEN_SEQUENCES = [
  ["det", "ved", "jeg", "ikke"],
  ["det", "ved", "jeg", "ik"],
  ["det", "ved", "jeg", "ikk"],
  ["ved", "det", "ikke"],
  ["ved", "det", "ik"],
  ["ved", "det", "ikk"],
  ["jeg", "ved", "det", "ikke"],
  ["jeg", "ved", "det", "ik"],
  ["jeg", "ved", "det", "ikk"],
  ["jeg", "ved", "ikke"],
  ["jeg", "ved", "ik"],
  ["jeg", "ved", "ikk"],
  ["ved", "jeg", "ikke"],
  ["ved", "jeg", "ik"],
  ["ved", "jeg", "ikk"],
  ["i", "dont", "know"],
  ["dont", "know"],
  ["i", "do", "not", "know"],
  ["do", "not", "know"],
  ["no", "idea"],
];

function normalizeIntentText(text) {
  return String(text || "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\bdon't\b/g, "dont")
    .replace(/\bdo not\b/g, "do not")
    .replace(/[^a-z0-9æøå\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsTokenSequence(tokens, sequence) {
  if (sequence.length > tokens.length) return false;

  for (let start = 0; start <= tokens.length - sequence.length; start += 1) {
    const matches = sequence.every((token, index) => tokens[start + index] === token);
    if (matches) return true;
  }

  return false;
}

export function isRevealAnswerIntent(transcription) {
  const tokens = normalizeIntentText(transcription).split(" ").filter(Boolean);
  if (!tokens.length) return false;

  return REVEAL_ANSWER_TOKEN_SEQUENCES.some((sequence) => containsTokenSequence(tokens, sequence));
}
