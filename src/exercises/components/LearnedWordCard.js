import * as s from "../exerciseTypes/Exercise.sc";

// After the answer that learned the word: the word itself, as on a flashcard
// (big, with its translation under a divider), in place of the exercise and
// its sentence. The sentence has done its job; what is left to see is the
// word that is now learned.
export default function LearnedWordCard({ bookmark }) {
  if (!bookmark) return null;
  return (
    <s.FlashcardFace className="learnedWordCard">
      <s.FlashcardWord>{bookmark.from}</s.FlashcardWord>
      <s.FlashcardDivider />
      <s.FlashcardAnswer>{bookmark.to}</s.FlashcardAnswer>
    </s.FlashcardFace>
  );
}
