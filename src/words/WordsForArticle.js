import { useParams, Link } from "react-router-dom";

import { useState, useEffect } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import Word from "./Word";

import { TopMessage } from "../components/TopMessage.sc";
import { NarrowColumn, CenteredContent } from "../components/ColumnWidth.sc";
import { OrangeButton, WhiteButton } from "../reader/ArticleReader.sc";
import { setTitle } from "../assorted/setTitle";

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

    api.logReaderActivity(api.WORDS_REVIEW, articleID);

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
      <br />
      <h1>Review Translations for Your Exercises </h1>

      <small>From "{articleInfo.title}"</small>
      <br />
      <br />
      <br />
      <TopMessage style={{ textAlign: "left" }}>
        {words.length > 0 ? (
          <>
            * Delete a translation if you don't want it in exercises.
            <br />
            <br />
            * Star a translations to make it have priority in exercises
            <br />
            <br />
            * If a translation is grayed out, it means that Zeeguu does not
            think it is appropriate for exercises; to overload this decision you
            can star the translation
            <br />
          </>
        ) : (
          "The words you translate in the article will appear here for review"
        )}
      </TopMessage>

      {words.map((each) => (
        <Word
          key={each.id}
          bookmark={each}
          notifyDelete={deleteBookmark}
          api={api}
        />
      ))}

      <br />
      <br />
      <br />
      <CenteredContent>
        <Link to={`/read/article?id=${articleID}`}>
          <WhiteButton>Back to Article</WhiteButton>
        </Link>

        {words.length > 0 && (
          <Link
            to={`/exercises/forArticle/${articleID}`}
            onClick={(e) =>
              api.logReaderActivity(api.TO_EXERCISES_AFTER_REVIEW, articleID)
            }
          >
            <OrangeButton>To Exercises</OrangeButton>
          </Link>
        )}
      </CenteredContent>
    </NarrowColumn>
  );
}
