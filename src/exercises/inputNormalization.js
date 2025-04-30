function removeAccents(str) {
  // Temporarily replace these with unique placeholders
  let placeholderCounter = 0;
  const placeholderMap = {};
  let tempStr = str.replace(/[ÅåÆæØø]/g, (match) => {
    const placeholder = `__SCANDI_${placeholderCounter++}__`;
    placeholderMap[placeholder] = match;
    return placeholder;
  });
  // Now normalize and remove diacritics
  tempStr = tempStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Restore the Scandinavian characters
  return tempStr.replace(
    /__SCANDI_(\d+)__/g,
    (_, num) => placeholderMap[`__SCANDI_${num}__`],
  );
}

function removeQuotes(x) {
  return x.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]/g, "");
}

function normalizeCase(x) {
  return x.trim().toUpperCase();
}

function normalizeAnswer(x) {
  return removeQuotes(removeAccents(normalizeCase(x)));
}

function testCasesForNormalization() {
  const testCases = [
    { input: "kød", output: "kød" },
    { input: "Olá", output: "Ola" },
    { input: "àl", output: "al" },
    { input: "æble", output: "æble" },
    { input: "Ål", output: "Ål" },
    { input: "çafe", output: "cafe" },
    { input: "hôtel", output: "hotel" },
    { input: "naïve", output: "naive" },
    { input: "über", output: "uber" },
    { input: "Mëtàl", output: "Metal" },
    { input: "Ångström", output: "Ångstrom" },
    { input: "Ḥālat", output: "Halat" },
    { input: "Ṣabr", output: "Sabr" },
    { input: "øl", output: "øl" },
    { input: "åre", output: "åre" },
    { input: "ß", output: "ß" },
    { input: "ñ", output: "n" },
    { input: "guarda-chuva", output: "guarda-chuva" },
  ];

  for (let i = 0; i < testCases.length; i++) {
    let test = removeAccents(testCases[i].input) === testCases[i].output;
    if (!test)
      console.error(
        `Failed (${testCases[i].input}): ${removeAccents(testCases[i].input)} === "${testCases[i].output}"`,
      );
  }
}

function testCasesForQuotes() {
  const testCases = [
    { input: "It's", output: "Its" },
    { input: "Guarda-chuva", output: "Guarda-chuva" },
    { input: '"open"', output: "open" },
  ];

  for (let i = 0; i < testCases.length; i++) {
    let test = removeQuotes(testCases[i].input) === testCases[i].output;
    if (!test)
      console.error(
        `Failed (${testCases[i].input}): ${removeQuotes(testCases[i].input)} === "${testCases[i].output}"`,
      );
  }
}

testCasesForNormalization();
testCasesForQuotes();

export { normalizeAnswer };
