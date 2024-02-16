import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import EditButton from "../../words/EditButton";
import * as s from "./Exercise.sc";
import SolutionFeedbackLinks from "./SolutionFeedbackLinks";
import { random } from "../../utils/basic/arrays";
import { useEffect, useState } from "react";

export default function NextNavigation({
  message,
  bookmarksToStudy,
  moveToNextExercise,
  api,
  reload,
  setReload,
  isReadContext,
  toggleShow,
  isCorrect,
  handleShowSolution,
}) {
  const correctStrings = [
    strings.correctExercise1,
    strings.correctExercise2,
    strings.correctExercise3,
  ];
  const solutionStrings = [
    strings.solutionExercise1,
    strings.solutionExercise2,
  ];

  const bookmarkToStudy = bookmarksToStudy[0];
  const exercise = "exercise";
  const [isConsideredCorrect, setIsConsideredCorrect] = useState(true);
  const correctMessage = useState(random(correctStrings));
  const solutionMessage = useState(random(solutionStrings));
  const [imgToDisplay, setImgToDisplay] = useState(null);
  const imgSrc = [
    "/static/icons/zeeguu-icon-correct.png",
    "/static/icons/zeeguu-icon-solution.png",
    "/static/icons/zeeguu-icon-wrong.png",
  ];

  function handleImgToDisplay(isCorrect, isSolution) {
    if (isCorrect) {
      setImgToDisplay(
        <img
          src={"/static/icons/zeeguu-icon-correct.png"}
          alt="Correct Icon"
        />,
      );
    } else {
      if (isSolution)
        setImgToDisplay(
          <img
            src={"/static/icons/zeeguu-icon-solution.png"}
            alt="Solution Icon"
          />,
        );
      else {
        setImgToDisplay(
          <img src={"/static/icons/zeeguu-icon-wrong.png"} alt="Wrong Icon" />,
        );
      }
    }
  }

  useEffect(() => {
    console.log("Message received: " + message);
    // Mirror what we do in the API
    let isCorrect = ["C", "TC", "TTC", "TTTC", "HC", "CCC"].includes(message);
    let isSolution = message.includes("S");
    setIsConsideredCorrect(isCorrect);
    handleImgToDisplay(isCorrect, isSolution);
  }, [isCorrect]);

  return (
    <>
      {imgSrc.map((e) => (
        <img src={e} style={{ display: "none" }} />
      ))}
      {isCorrect ? (
        <div className="next-nav-feedback">
          {imgToDisplay}
          <p>
            <b>{isConsideredCorrect ? correctMessage : solutionMessage}</b>
          </p>
        </div>
      ) : (
        <> </>
      )}
      {isCorrect && bookmarksToStudy.length === 1 && (
        <s.BottomRowSmallTopMargin className="bottomRow">
          <s.EditSpeakButtonHolder>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              style="next"
              isReadContext={isReadContext}
            />
            <EditButton
              bookmark={bookmarksToStudy[0]}
              api={api}
              styling={exercise}
              reload={reload}
              setReload={setReload}
            />
          </s.EditSpeakButtonHolder>
          <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
            {strings.next}
          </s.FeedbackButton>
        </s.BottomRowSmallTopMargin>
      )}
      {isCorrect && bookmarksToStudy.length !== 1 && (
        <s.BottomRowSmallTopMargin className="bottomRow">
          <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
            {strings.next}
          </s.FeedbackButton>
        </s.BottomRowSmallTopMargin>
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </>
  );
}
