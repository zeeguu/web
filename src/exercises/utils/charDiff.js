// Character-level diff of a typed answer against the expected one, via the
// longest common subsequence. Returns a list of
//   { type: "same" | "del" | "add", ch }
// where "del" letters are in the typed word only and "add" letters in the
// expected word only. Comparison ignores case; "same" letters take the
// expected word's casing.
export function charDiff(typed, expected) {
  const a = [...typed];
  const b = [...expected];
  const al = a.map((c) => c.toLowerCase());
  const bl = b.map((c) => c.toLowerCase());

  // lcs[i][j] = LCS length of a[i..] and b[j..]
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = al[i] === bl[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const ops = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (al[i] === bl[j]) {
      ops.push({ type: "same", ch: b[j] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      ops.push({ type: "del", ch: a[i++] });
    } else {
      ops.push({ type: "add", ch: b[j++] });
    }
  }
  while (i < a.length) ops.push({ type: "del", ch: a[i++] });
  while (j < b.length) ops.push({ type: "add", ch: b[j++] });
  return ops;
}

// A letter-level diff only reads as a correction when most of the word
// survives; for a different word (tænker → synes) it's letter soup, so
// callers fall back to swapping the whole word.
export function isCloseMiss(ops, expected) {
  const same = ops.filter((op) => op.type === "same").length;
  return same >= Math.ceil([...expected].length / 2);
}
