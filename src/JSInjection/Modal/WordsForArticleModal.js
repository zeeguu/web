import { useState, useEffect } from "react";
import LoadingAnimation from "../../zeeguu-react/src/components/LoadingAnimation";
import {
  NarrowColumn,
  CenteredContent,
} from "../../zeeguu-react/src/components/ColumnWidth.sc";
import { setTitle } from "../../zeeguu-react/src/assorted/setTitle";
import strings from "../../zeeguu-react/src/i18n/definitions";
import { EXTENSION_SOURCE } from "../constants";
import WordsToReview from "../../zeeguu-react/src/words/WordsToReview";
import BackArrow from "../../zeeguu-react/src/pages/Settings/settings_pages_shared/BackArrow";
import { StyledButton } from "../../zeeguu-react/src/components/allButtons.sc.js";
import { WEB_URL } from "../../config.js";
import Tooltip from "@mui/material/Tooltip";

function fit_for_study(words) {
  return words.filter((b) => b.fit_for_study || b.starred).length > 0;
}

export default function WordsForArticleModal({ api, articleID, openArticle }) {
  const [words, setWords] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);
  const [exercisesEnabled, setExercisesEnabled] = useState(false);

  useEffect(() => {
    if (articleID) {
      api.prioritizeBookmarksToStudy(articleID, setWords);
      api.getArticleInfo(articleID, (data) => {
        setArticleInfo(data);
        setTitle('Words in "' + data.title + '"');
      });
      api.logReaderActivity(api.WORDS_REVIEW, articleID, "", EXTENSION_SOURCE);
    }
  }, [articleID]);

  useEffect(() => {
    if (words) setExercisesEnabled(fit_for_study(words));
  }, [words]);

  if (words === null || articleInfo === null) {
    return <LoadingAnimation />;
  }

  function logGoingToExercisesAfterReview(e) {
    return api.logReaderActivity(
      api.TO_EXERCISES_AFTER_REVIEW,
      articleID,
      "",
      EXTENSION_SOURCE
    );
  }

  const toExercises = async (e) => {
    e.preventDefault();
    try {
      logGoingToExercisesAfterReview(e);
      window.open(`${WEB_URL}/articleWordReview/${articleID}`);
    } catch (error) {
      console.error("Error during logging and navigation:", error);
    }
  };

  const toScheduledExercises = async (e) => {
    window.open(`${WEB_URL}/exercises/`);
  };

  function deleteBookmark(bookmark) {
    let newWords = [...words].filter((e) => e.id !== bookmark.id);
    setWords(newWords);
    setExercisesEnabled(fit_for_study(newWords));
  }

  function notifyWordChanged(bookmark) {
    let newWords = words.map((word) =>
      word.id === bookmark.id ? bookmark : word
    );
    setWords(newWords);
    setExercisesEnabled(fit_for_study(newWords));
  }

  return (
    <NarrowColumn style={{ marginTop: "2em" }}>
      <BackArrow func={openArticle} />
      <WordsToReview
        words={words}
        deleteBookmark={deleteBookmark}
        articleInfo={articleInfo}
        api={api}
        notifyWordChanged={notifyWordChanged}
        source={EXTENSION_SOURCE}
      />
      <CenteredContent style={{ marginBottom: "2em" }}>
        {!exercisesEnabled ? (
          <Tooltip
            title="You need to translate words in the article first."
            arrow
          >
            <span>
              <StyledButton disabled>{strings.toPracticeWords}</StyledButton>
            </span>
          </Tooltip>
        ) : (
          <StyledButton navigation onClick={toExercises}>
            {strings.toPracticeWords}
          </StyledButton>
        )}
        <StyledButton primary onClick={toScheduledExercises}>
          Scheduled Exercises
        </StyledButton>
      </CenteredContent>
    </NarrowColumn>
  );
}
