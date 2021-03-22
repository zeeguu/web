function MultipleChoicesInput({
  handleCorrectAnswer,
  bookmarkToStudy,
  randomWords,
  notifyChoiceSelection,
  notifyIncorrectAnswer,
}) {
  return (
    <div>
      <button>{bookmarkToStudy.from}</button>
      <button>{randomWords[0]}</button>
      <button>{randomWords[1]}</button>
    </div>
  );
}

export default MultipleChoicesInput;
