import { useState, useContext } from "react";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import * as s from "../Exercise.sc";
import { removePunctuation } from "../../../utils/text/preprocessing";
import {
  zeeguuOrange,
  tableau_1,
  tableau_2,
  tableau_3,
  tableau_4,
  tableau_5,
  tableau_6,
  tableau_7,
  tableau_8,
  tableau_9,
  tableau_10,
} from "../../../components/colors";
import { seededShuffle } from "../../../assorted/fisherYatesShuffle.js";

function MatchInput({
  exerciseBookmarks,
  selectedLeftBookmark,
  setSelectedLeftBookmark,
  selectedRightBookmark,
  setSelectedRightBookmark,
  listOfSolvedBookmarks,
  wrongAnimationsDictionary,
  setWrongAnimationsDictionary,
}) {
  const answerColors = [
    {
      fontWeight: "700",
      color: `${tableau_1}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_2}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_3}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_4}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_5}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_6}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_7}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_8}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_9}`,
    },
    {
      fontWeight: "700",
      color: `${tableau_10}`,
    },
  ];

  const selectedButtonColor = {
    background: `${zeeguuOrange}`,
    color: "black",
    border: `0.15em solid ${zeeguuOrange}`,
  };

  const speech = useContext(SpeechContext);
  const [isPronouncing, setIsPronouncing] = useState(false);

  const RIGHT = true;
  const LEFT = !RIGHT;

  // Lazy initialisation: compute once on mount so the state is never undefined
  // and there's no blank render between mount and the first effect flush.
  // Seeded from bookmark IDs so StrictMode's remount produces the identical order.
  const seed = exerciseBookmarks.reduce((acc, b) => acc + b.id, 0);
  const [leftBookmarksShuffled] = useState(() => seededShuffle(exerciseBookmarks, seed));
  const [rightBookmarksShuffled] = useState(() => seededShuffle(exerciseBookmarks, seed + 1));

  function isSameBookmark(b1, b2) {
    if (b1 === null || b2 === null || b1 === undefined || b2 === undefined) return false;
    if (b1.id === b2.id) return true;
    return false;
  }

  function handleClick(e, bookmark, side) {
    e.preventDefault();
    if (listOfSolvedBookmarks.includes(bookmark.id)) return;
    if (side === LEFT)
      isSameBookmark(selectedLeftBookmark, bookmark) ? setSelectedLeftBookmark() : setSelectedLeftBookmark(bookmark);
    else if (side === RIGHT)
      isSameBookmark(selectedRightBookmark, bookmark) ? setSelectedRightBookmark() : setSelectedRightBookmark(bookmark);
  }

  function renderButton(b, index, side) {
    let key = side === LEFT ? "L2_" + index : "L1_" + index;
    let solvedIndex = listOfSolvedBookmarks.indexOf(b.id);
    let selectedBookmark = side === LEFT ? selectedLeftBookmark : selectedRightBookmark;
    let word = side === LEFT ? b.from : b.to;
    let isWrong = wrongAnimationsDictionary[side].includes(b.id);
    if (solvedIndex !== -1) {
      const isSpeakable = side === LEFT && !isPronouncing;
      return (
        <s.MatchingWords
          className="matchingWords"
          style={{
            ...answerColors[solvedIndex],
            ...(side === LEFT && { textDecoration: "underline dotted", textUnderlineOffset: "6px", cursor: "pointer" }),
          }}
          onClick={isSpeakable ? () => speech.speakOut(b.from, setIsPronouncing) : undefined}
          key={key}
        >
          {removePunctuation(word)}
        </s.MatchingWords>
      );
    }
    if (isWrong)
      return (
        <s.AnimatedMatchButton
          key={key}
          style={isSameBookmark(b, selectedBookmark) ? selectedButtonColor : {}}
          onClick={(e) => handleClick(e, b, side)}
          onAnimationEnd={() => {
            let _newWrongAnimationDictionary = { ...wrongAnimationsDictionary };
            _newWrongAnimationDictionary[side] = _newWrongAnimationDictionary[side].filter((id) => id !== b.id);
            setWrongAnimationsDictionary(_newWrongAnimationDictionary);
          }}
        >
          {removePunctuation(word)}
        </s.AnimatedMatchButton>
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
          {leftBookmarksShuffled.map((b, index) => renderButton(b, index, LEFT))}
        </s.MatchButtonHolder>
        <s.MatchButtonHolderRight>
          {rightBookmarksShuffled.map((b, index) => renderButton(b, index, RIGHT))}
        </s.MatchButtonHolderRight>
      </s.MatchInputHolder>
    </>
  );
}

export default MatchInput;
