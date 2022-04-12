import { useParams } from "react-router-dom";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { useState, useEffect } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import WordsToReview from "./WordsToReview";
import { NarrowColumn, CenteredContent, ToolTipsContainer} from "../components/ColumnWidth.sc";
import { NavigationLink } from "../reader/ArticleReader.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

function fit_for_study(words) {
  return words.filter((b) => b.fit_for_study || b.starred).length > 0;
}

export default function WordsForArticle({ api }) {
  let { articleID } = useParams();
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

    api.logReaderActivity(api.WORDS_REVIEW, articleID, "", UMR_SOURCE);

    // eslint-disable-next-line
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

  function logGoingToExercisesAfterReview(e) {
    api.logReaderActivity(
      api.TO_EXERCISES_AFTER_REVIEW,
      articleID,
      "",
      UMR_SOURCE
    );
  }

  return (
    <NarrowColumn>
      <WordsToReview
        words={words}
        deleteBookmark={deleteBookmark}
        articleInfo={articleInfo}
        api={api}
        notifyWordChanged={notifyWordChanged}
        source={UMR_SOURCE}
      />

      <CenteredContent>
        <NavigationLink prev secondary to={`/read/article?id=${articleID}`}>
          {strings.backToArticle}
        </NavigationLink>
        <ToolTipsContainer>
          <NavigationLink
            primary
            next
            {...(exercisesEnabled || { disabled: true })}
            to={`/exercises/forArticle/${articleID}`}
            onClick={logGoingToExercisesAfterReview}
          >
            {strings.toExercises}
          </NavigationLink>
          {!exercisesEnabled ? (
            <span className="tooltiptext">
              You need to star words <br />
              before going to exercises
            </span>
          ) : null}{" "}
        </ToolTipsContainer>
      </CenteredContent>
    </NarrowColumn>
  );
}
