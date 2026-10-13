import InteractiveText from "../../../reader/InteractiveText";

// A student's text for their teacher: the student's translations shown in
// place (open from the start), and nothing the teacher does creates a
// translation, a sound or a log entry.
export default class ReadOnlyInteractiveText extends InteractiveText {
  constructor(args) {
    super({ ...args, source: "teacher_view" });
    this.readOnly = true;
    this.getParagraphs().forEach((paragraph) =>
      paragraph.getWords().forEach((word) => {
        if (word.translation) word.isTranslationVisible = true;
      }),
    );
  }

  translate(word, fuseWithNeighbours, onSuccess) {
    onSuccess && onSuccess();
  }
  pronounce() {}
  fetchAlternatives(word, onComplete) {
    onComplete && onComplete();
  }
}
