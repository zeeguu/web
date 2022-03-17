import { useState, useEffect } from "react";
import LoadingAnimation from "../../zeeguu-react/src/components/LoadingAnimation";
import { NarrowColumn, CenteredContent} from "../../zeeguu-react/src/components/ColumnWidth.sc";
import { setTitle } from "../../zeeguu-react/src/assorted/setTitle";
import strings from "../../zeeguu-react/src/i18n/definitions";
import { EXTENSION_SOURCE } from "../constants";
import WordsToReview from "./WordsInReview";
import { StyledButtonWhite, StyledButtonOrange } from "./Modal.styles";

export default function WordsForArticleModal({ api, articleID, openExercises, openArticle }) {
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
    api.logReaderActivity(api.WORDS_REVIEW, articleID, "", EXTENSION_SOURCE);
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
      <StyledButtonWhite onClick={openArticle}>{strings.backToArticle}</StyledButtonWhite>
        {words.length > 0 && (
            <StyledButtonOrange onClick={openExercises}>{strings.toExercises}</StyledButtonOrange>
        )}
      </CenteredContent>
    </NarrowColumn>
  );
}