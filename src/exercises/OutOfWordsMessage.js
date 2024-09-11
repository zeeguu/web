import * as s from "./exerciseTypes/Exercise.sc";
import * as sc from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState, useEffect } from "react";
import { MAX_EXERCISE_IN_LEARNING_BOOKMARKS } from "./ExerciseConstants";
import LoadingAnimation from "../components/LoadingAnimation";

export default function OutOfWordsMessage({
  isAbleToAddBookmarksToPipe,
  totalInLearning,
  goBackAction,
  keepExercisingAction,
}) {
  if (isAbleToAddBookmarksToPipe === undefined)
    return <LoadingAnimation></LoadingAnimation>;
  return (
    <s.Exercise>
      <div className="contextExample">
        <h2>{strings.noTranslatedWords}</h2>
        <p>
          The reason might be that either you don't have enough translated words
          or you have already practiced the words you are currently learning. We
          will let you know when it's time to practice them again.
        </p>
        <p>
          If you want to practice more, go to the articles and translate some
          new words.
        </p>
        <p>
          You are currently learning <b>{totalInLearning}</b>{" "}
          {totalInLearning > 1 ? "words" : "word"}.
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
