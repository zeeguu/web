import { useParams, Link } from "react-router-dom";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { useState, useEffect } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import Word from "./Word";

import { TopMessage } from "../components/TopMessage.sc";
import { NarrowColumn, CenteredContent } from "../components/ColumnWidth.sc";
import {
  OrangeButton,
  WhiteButton,
  ContentOnRow,
} from "../reader/ArticleReader.sc";
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

    api.logReaderActivity(UMR_SOURCE, api.WORDS_REVIEW, articleID);

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
      <h1>{strings.ReviewTranslations}</h1>

      <small>{strings.from}{articleInfo.title}</small>
      <br />
      <br />
      <br />
      <TopMessage style={{ textAlign: "left" }}>
        {words.length > 0 ? (
          <>
            * {strings.deleteTranslation}
            <br />
            <br />
            * {strings.starTranslation}
            <br />
            <br />
            * {strings.ifGreyedTranslation}
            <br />
          </>
        ) : (
          strings.theWordsYouTranslate
        )}
      </TopMessage>

      {words.map((each) => (
        <ContentOnRow>
          <Word
            key={each.id}
            bookmark={each}
            notifyDelete={deleteBookmark}
            api={api}
          />
        </ContentOnRow>
      ))}

      <br />
      <br />
      <br />
      <CenteredContent>
        <Link to={`/read/article?id=${articleID}`}>
          <WhiteButton>{strings.backToArticle}</WhiteButton>
        </Link>

        {words.length > 0 && (
          <Link
            to={`/exercises/forArticle/${articleID}`}
            onClick={(e) =>
              api.logReaderActivity(UMR_SOURCE, api.TO_EXERCISES_AFTER_REVIEW, articleID)
            }
          >
            <OrangeButton>{strings.toExercises}</OrangeButton>
          </Link>
        )}
      </CenteredContent>
    </NarrowColumn>
  );
}
