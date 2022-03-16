import { useState, useEffect } from "react";
import LoadingAnimation from "../../zeeguu-react/src/components/LoadingAnimation";
import Word from "../../zeeguu-react/src/words/Word";
import { TopMessage } from "../../zeeguu-react/src/components/TopMessage.sc";
import { NarrowColumn, CenteredContent} from "../../zeeguu-react/src/components/ColumnWidth.sc";
import {OrangeButton,WhiteButton,ContentOnRow} from "../../zeeguu-react/src/reader/ArticleReader.sc";
import { setTitle } from "../../zeeguu-react/src/assorted/setTitle";
import strings from "../../zeeguu-react/src/i18n/definitions";
import { EXTENSION_SOURCE } from "../constants";
import WordsToReview from "./WordsInReview";

export default function WordsForArticleModal({ api, articleID }) {
  const [words, setWords] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);

  useEffect(() => {
    api.bookmarksForArticle(articleID, (bookmarks) => {
      setWords(bookmarks);
      console.dir(bookmarks);
    });
    console.log(articleID)
    api.getArticleInfo(articleID, (data) => {
      setArticleInfo(data);
      setTitle('Words in "' + data.title + '"');
    });
    api.logReaderActivity(EXTENSION_SOURCE, api.WORDS_REVIEW, articleID);

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
        {words.length > 0 && (
          <a href="#"
            onClick={(e) =>
              api.logReaderActivity(EXTENSION_SOURCE, api.TO_EXERCISES_AFTER_REVIEW, articleID)
            }
          >
            <OrangeButton>{strings.toExercises}</OrangeButton>
          </a>
        )}
      </CenteredContent>
    </NarrowColumn>
  );
}
//  <a href={`/exercises/forArticle/${articleID}`}