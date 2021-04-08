import { useState, useEffect } from "react";

function MultipleChoicesInput({
  bookmarkToStudy,
  otherBookmarksToStudyList,
  notifyChoiceSelection,
  isIncorrect,
  incorrectAnswer,
}) {
  const [buttonOptions, setButtonOptions] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => {
    if (otherBookmarksToStudyList && !buttonOptions) {
      consolidateAllButtonOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkToStudy]);

  useEffect(() => {
    if (incorrectAnswer) {
      setIncorrectAnswers([...incorrectAnswers, incorrectAnswer]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifyChoiceSelection]);

  function consolidateAllButtonOptions() {
    let randomOtherOptions = chooseTwoRandomOtherOptions();
    let listOfOptions = [
      bookmarkToStudy,
      randomOtherOptions[0],
      randomOtherOptions[1],
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);

    setButtonOptions(shuffledListOfOptions);
  }

  function chooseTwoRandomOtherOptions() {
    let shuffledOtherOptions = shuffle(otherBookmarksToStudyList);
    let twoRandomOptions = [shuffledOtherOptions[0], shuffledOtherOptions[1]];

    return twoRandomOptions;
  }

  /*Fisher-Yates (aka Knuth) Shuffle - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array*/
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  return (
    <div className="bottomInput">
      {buttonOptions ? (
        buttonOptions.map((option) => (
          <button
            key={option.from}
            id={option.from}
            onClick={(e) => notifyChoiceSelection(e.target.id)}
            disabled={isIncorrect && incorrectAnswers.includes(option.from)}
          >
            {option.from}
          </button>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

export default MultipleChoicesInput;
