import { useParams, Link } from "react-router-dom";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { useState, useEffect } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import WordsToReview from "./WordsToReview";
import { NarrowColumn, CenteredContent } from "../components/ColumnWidth.sc";
import {OrangeButton, WhiteButton} from "../reader/ArticleReader.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

export default function WordsForArticle({ api }) {
  let { articleID } = useParams();
  const [words, setWords] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);

  useEffect(() => {
    api.bookmarksForArticle(articleID, (bookmarks) => {
      setWords(bookmarks);
      console.dir(bookmarks);
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
    setWords(words.filter((e) => e.id !== bookmark.id));
  }

  return (
    <NarrowColumn>
      <WordsToReview words={words} deleteBookmark={deleteBookmark} articleInfo={articleInfo} api={api}/>
      <CenteredContent>
        <Link to={`/read/article?id=${articleID}`}>
          <WhiteButton>{strings.backToArticle}</WhiteButton>
        </Link>
        {words.length > 0 && (
          <Link
            to={`/exercises/forArticle/${articleID}`}
            onClick={(e) =>
              api.logReaderActivity(api.TO_EXERCISES_AFTER_REVIEW, articleID, "", UMR_SOURCE)
            }
          >
            <OrangeButton>{strings.toExercises}</OrangeButton>
          </Link>
        )}
      </CenteredContent>
    </NarrowColumn>
  );
}
