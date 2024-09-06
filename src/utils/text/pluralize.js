class Pluralize {
  static word(count) {
    return count === 1 ? "word" : "words";
  }

  static is(count) {
    return count === 1 ? "is" : "are";
  }
}

export default Pluralize;
