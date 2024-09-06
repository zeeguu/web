class Pluralize {
  // This method takes a number and returns the correct form of "has" or "have"
  static word(count) {
    return count === 1 ? "word" : "words";
  }
}

export default Pluralize;
