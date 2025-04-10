import { useEffect, useState } from "react";
import SpeakButton from "../SpeakButton";
import * as s from "../Exercise.sc";
import { removePunctuation } from "../../../utils/text/preprocessing";
import EditBookmarkButton from "../../../words/EditBookmarkButton.js";
import {
  zeeguuOrange,
  darkBlue,
  matchGreen,
  zeeguuViolet,
} from "../../../components/colors";
import shuffle from "../../../assorted/fisherYatesShuffle.js";

function MatchInput({
  exerciseBookmarks,
  selectedLeftBookmark,
  setSelectedLeftBookmark,
  selectedRightBookmark,
  setSelectedRightBookmark,
  listOfSolvedBookmarks,
  wrongAnimationsDictionary,
  setWrongAnimationsDictionary,
  isExerciseOver,
  reload,
  setReload,
  notifyBookmarkDeletion,
  isPronouncing,
  lastCorrectBookmarkId,
}) {
  const answerColors = [
    {
      fontWeight: "700",
      color: `${matchGreen}`,
    },
    {
      fontWeight: "700",
      color: `${darkBlue}`,
    },
    {
      fontWeight: "700",
      color: `${zeeguuViolet}`,
    },
  ];

  const selectedButtonColor = {
    background: `${zeeguuOrange}`,
    color: "black",
    border: `0.15em solid ${zeeguuOrange}`,
  };

  const [leftBookmarksShuffled, setLeftBookmarkShuffled] = useState();
  const [rightBookmarksShuffled, setRightBookmarkShuffled] = useState();
  const RIGHT = true;
  const LEFT = !RIGHT;

  useEffect(() => {
    // Shuffling is in place so we need to unpack otherwise
    // they result in the same.
    setLeftBookmarkShuffled(shuffle([...exerciseBookmarks]));
    setRightBookmarkShuffled(shuffle([...exerciseBookmarks]));
  }, []);

  if (!leftBookmarksShuffled || !rightBookmarksShuffled) return <></>;

  function isSameBookmark(b1, b2) {
    if (b1 === null || b2 === null || b1 === undefined || b2 === undefined)
      return false;
    if (b1.id === b2.id) return true;
    return false;
  }

  function handleClick(e, bookmark, side) {
    e.preventDefault();
    if (listOfSolvedBookmarks.includes(bookmark.id)) return;
    if (side === LEFT)
      isSameBookmark(selectedLeftBookmark, bookmark)
        ? setSelectedLeftBookmark()
        : setSelectedLeftBookmark(bookmark);
    else if (side === RIGHT)
      isSameBookmark(selectedRightBookmark, bookmark)
        ? setSelectedRightBookmark()
        : setSelectedRightBookmark(bookmark);
  }

  function renderSolutionButton(b, key, solvedIndex, word) {
    const small = "small";
    const match = "match";

    return (
      <s.ButtonRow key={key}>
        <EditBookmarkButton
          bookmark={b}
          styling={match}
          reload={reload}
          setReload={setReload}
          notifyDelete={() => notifyBookmarkDeletion(b)}
        />
        <s.MatchingWords
          className="matchingWords"
          style={answerColors[solvedIndex]}
          key={key}
        >
          {removePunctuation(word)}
        </s.MatchingWords>
        <s.MatchSpeakButtonHolder>
          <SpeakButton
            bookmarkToStudy={b}
            styling={small}
            key={key}
            parentIsSpeakingControl={
              b.id === lastCorrectBookmarkId && isPronouncing
            }
          />
        </s.MatchSpeakButtonHolder>
      </s.ButtonRow>
    );
  }

  function renderButton(b, index, side) {
    let key = side === LEFT ? "L2_" + index : "L1_" + index;
    let solvedIndex = listOfSolvedBookmarks.indexOf(b.id);
    let selectedBookmark =
      side === LEFT ? selectedLeftBookmark : selectedRightBookmark;
    let word = side === LEFT ? b.from : b.to;
    let isWrong = wrongAnimationsDictionary[side].includes(b.id);
    if (isExerciseOver && side === LEFT)
      return renderSolutionButton(b, key, solvedIndex, word);
    if (isWrong)
      return (
        <s.AnimatedMatchButton
          key={key}
          style={isSameBookmark(b, selectedBookmark) ? selectedButtonColor : {}}
          onClick={(e) => handleClick(e, b, side)}
          onAnimationEnd={() => {
            let _newWrongAnimationDictionary = { ...wrongAnimationsDictionary };
            _newWrongAnimationDictionary[side] = _newWrongAnimationDictionary[
              side
            ].filter((id) => id !== b.id);
            setWrongAnimationsDictionary(_newWrongAnimationDictionary);
          }}
        >
          {removePunctuation(word)}
        </s.AnimatedMatchButton>
      );
    if (solvedIndex !== -1)
      return (
        <s.MatchingWords
          className="matchingWords"
          style={answerColors[solvedIndex]}
          key={key}
        >
          {removePunctuation(word)}
        </s.MatchingWords>
      );
    return (
      <s.MatchButton
        style={isSameBookmark(b, selectedBookmark) ? selectedButtonColor : {}}
        key={key}
        onClick={(e) => handleClick(e, b, side)}
      >
        {removePunctuation(word)}
      </s.MatchButton>
    );
  }

  return (
    <>
      <s.MatchInputHolder className="matchInputHolder">
        <s.MatchButtonHolder>
          {leftBookmarksShuffled.map((b, index) =>
            renderButton(b, index, LEFT),
          )}
        </s.MatchButtonHolder>
        <s.MatchButtonHolderRight>
          {rightBookmarksShuffled.map((b, index) =>
            renderButton(b, index, RIGHT),
          )}
          {/*toButtonOptions ? (
            toButtonOptions.map((option) =>
              Number(incorrectAnswer) === option.id &&
              firstSelectionColumn !== "to" ? (
                <s.AnimatedMatchButton
                  key={"L1_" + option.id}
                  id={option.id}
                  onClick={(e) => handleClick("to", Number(e.target.id))}
                  onAnimationEnd={() => setIncorrectAnswer("")}
                >
                  {removePunctuation(option.to.toLowerCase())}
                </s.AnimatedMatchButton>
              ) : buttonsToDisable.includes(option.id) || isExerciseOver ? (
                <s.MatchingWords
                  className="matchingWords"
                  style={answerPairStyle(option.id)}
                  key={"L1_" + option.id}
                >
                  {removePunctuation(option.to.toLowerCase())}
                </s.MatchingWords>
              ) : (
                <s.MatchButton
                  style={selectedButtonStyle("to", option.id)}
                  key={"L1_" + option.id}
                  id={option.id}
                  onClick={(e) => handleClick("to", Number(e.target.id))}
                >
                  {removePunctuation(option.to.toLowerCase())}
                </s.MatchButton>
              ),
            )
          ) : (
            <></>
          )*/}
        </s.MatchButtonHolderRight>
      </s.MatchInputHolder>
    </>
  );
}

export default MatchInput;
