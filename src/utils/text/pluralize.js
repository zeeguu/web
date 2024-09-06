class Pluralize {
  static _pickRightForm(count, singular, plural) {
    return count === 1 ? singular : plural;
  }
  static word(count) {
    this._pickRightForm(count, "word", "words");
  }
  static second(count) {
    this._pickRightForm(count, "second", "seconds");
  }
  static minute(count) {
    this._pickRightForm(count, "minute", "minutes");
  }
  static is(count) {
    this._pickRightForm(count, "is", "are");
  }
}

export default Pluralize;
