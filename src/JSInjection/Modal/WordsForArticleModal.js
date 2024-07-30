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
import { NavigationButton } from "./Buttons.styles";
import { ToolTipsContainer } from "./WordsForArticleModal.styles";

function fit_for_study(words) {
  return words.filter((b) => b.fit_for_study || b.starred).length > 0;
}

export default function WordsForArticleModal({
  api,
  articleID,
  openExercises,
  openArticle,
}) {
  const [words, setWords] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);
  const [exercisesEnabled, setExercisesEnabled] = useState(false);

  useEffect(() => {
    api.bookmarksForArticle(articleID, (bookmarks) => {
      setWords(bookmarks);
      setExercisesEnabled(fit_for_study(bookmarks));
    });
    api.getArticleInfo(articleID, (data) => {
      setArticleInfo(data);
      setTitle('Words in "' + data.title + '"');
    });
    api.logReaderActivity(api.WORDS_REVIEW, articleID, "", EXTENSION_SOURCE);
  }, []);

  if (words === null || articleInfo === null) {
    return <LoadingAnimation />;
  }

  function deleteBookmark(bookmark) {
    let newWords = words.filter((e) => e.id !== bookmark.id);
    setWords(newWords);
    setExercisesEnabled(fit_for_study(newWords));
  }

  function notifyWordChanged() {
    setExercisesEnabled(fit_for_study(words));
  }

  return (
    <NarrowColumn className="narrowColumn">
      <WordsToReview
        words={words}
        deleteBookmark={deleteBookmark}
        articleInfo={articleInfo}
        api={api}
        notifyWordChanged={notifyWordChanged}
      />
      <br />
      <br />
      <CenteredContent>
        <NavigationButton prev secondary onClick={openArticle}>
          {strings.backToArticle}
        </NavigationButton>

        <NavigationButton
          primary
          next
          {...(exercisesEnabled || { disabled: true })}
          onClick={openExercises}
        >
          {strings.toExercises}
        </NavigationButton>
      </CenteredContent>
      <br />
      <br />
    </NarrowColumn>
  );
}
