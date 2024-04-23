import * as s from "./exerciseTypes/Exercise.sc";
import * as sc from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState, useEffect } from "react";
import { MAX_EXERCISE_IN_LEARNING_BOOKMARKS } from "./ExerciseConstants";
import LoadingAnimation from "../components/LoadingAnimation";

export default function OutOfWordsMessage({
  api,
  totalInLearning,
  goBackAction,
  keepExercisingAction,
}) {
  const [isAbleToAddBookmarksToPipe, setIsAbleToAddBookmarksToPipe] =
    useState();
  useEffect(() => {
    api.getNewBookmarksToStudy(1, (new_bookmarks) => {
      setIsAbleToAddBookmarksToPipe(new_bookmarks.length > 0);
    });
  });
  if (isAbleToAddBookmarksToPipe === undefined)
    return <LoadingAnimation></LoadingAnimation>;
  return (
    <s.Exercise>
      <div className="contextExample">
        <h2>{strings.noTranslatedWords}</h2>
        <p>
          The reason might be that you either have not enough translations, or
          you might have already practiced enough your current words and the
          spaced repetition algorithm.
        </p>
        <p>
          You are currently learning: <b>{totalInLearning}</b> words.
        </p>
        <p>
          We recommend that you are at most learning{" "}
          <b>{MAX_EXERCISE_IN_LEARNING_BOOKMARKS}</b> words.
        </p>
        {isAbleToAddBookmarksToPipe && (
          <p>
            You can always add more by clicking the "Start learning new words"
            button. This will add up to a maximum of <b>10</b> new words, if
            possible.
          </p>
        )}
      </div>
      <s.BottomRow>
        <sc.OrangeButton onClick={goBackAction}>
          {"Go to reading"}
        </sc.OrangeButton>
        {isAbleToAddBookmarksToPipe && (
          <sc.OrangeButton
            style={{ minWidth: "10em" }}
            onClick={() => {
              keepExercisingAction();
            }}
          >
            {"Start learning new words"}
          </sc.OrangeButton>
        )}
      </s.BottomRow>
    </s.Exercise>
  );
}
