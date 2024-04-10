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
  const [userIsCorrect, setUserIsCorrect] = useState();
  const [correctMessage, setCorrectMessage] = useState("");
  const [learningCycle, setLearningCycle] = useState(bookmarkToStudy.learning_cycle);

  useEffect(() => {
    setLearningCycle(bookmarkToStudy.learning_cycle);
  }, [bookmarkToStudy.learning_cycle]);

  useEffect(() => {
    const userIsCorrect = (message.includes("C"));
    setUserIsCorrect(userIsCorrect);
  }, [message]);

  useEffect(() => {
    if (userIsCorrect) {
      setCorrectMessage(random(correctStrings));
    }
  }, [userIsCorrect]);

  return (
    <>
      {isCorrect && userIsCorrect && (
        (learningCycle === 1 && bookmarkToStudy.is_last_in_cycle) ? (
          <div className="next-nav-learning-cycle">
            <img
              src={"/static/icons/zeeguu-icon-correct.png"}
              alt="Correct Icon"
            />
            <p>
              <b>{correctMessage}&nbsp;{strings.nextLearningCycle}</b>
            </p>
          </div>
        ) : (
          <div className="next-nav-feedback">
            <img
              src={"/static/icons/zeeguu-icon-correct.png"}
              alt="Correct Icon"
            />
            <p>
              <b>{correctMessage}</b>
            </p>
          </div>
        ))
      }
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
