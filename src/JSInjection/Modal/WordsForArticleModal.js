import { useState, useEffect } from "react";
import LoadingAnimation from "../../zeeguu-react/src/components/LoadingAnimation";
import { NarrowColumn, CenteredContent} from "../../zeeguu-react/src/components/ColumnWidth.sc";
import {OrangeButton} from "../../zeeguu-react/src/reader/ArticleReader.sc";
import { setTitle } from "../../zeeguu-react/src/assorted/setTitle";
import strings from "../../zeeguu-react/src/i18n/definitions";
import { EXTENSION_SOURCE } from "../constants";
import WordsToReview from "./WordsInReview";
//import Exercises from "../../zeeguu-react/src/exercises/Exercises"
import Exercises from "../../zeeguu-react/src/exercises/Exercises";
export default function WordsForArticleModal({ api, articleID }) {
  const [words, setWords] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);
  const [exercises, setExercises] = useState(false)

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

    // eslint-disable-next-line
  }, []);

  if (words === null || articleInfo === null) {
    return <LoadingAnimation />;
  }

  function deleteBookmark(bookmark) {
    setWords(words.filter((e) => e.id !== bookmark.id));
  }

  function openExercises(){
    setExercises(true)
    api.logReaderActivity(api.TO_EXERCISES_AFTER_REVIEW, articleID, "", EXTENSION_SOURCE)

  }

  function keepExercising(){
    alert("Keep exercising")
  }

  function backToReading(){
    setExercises(false)
  }

  function goBack(){
    setExercises(false)
  }

  return (
    <NarrowColumn> 
    {exercises === false && (
      <>
    <WordsToReview words={words} deleteBookmark={deleteBookmark} articleInfo={articleInfo} api={api}/>
      <CenteredContent>
        {words.length > 0 && (
            <OrangeButton onClick={openExercises}>{strings.toExercises}</OrangeButton>
        )}
      </CenteredContent>
      </>
    )}
 {exercises === true && (
   <>
   <Exercises api={api} articleID={articleID} source={EXTENSION_SOURCE} backToReading={backToReading} keepExercising={keepExercising} goBack={goBack} />;
   </>
 )}
    </NarrowColumn>
  );
}
//  <a href={`/exercises/forArticle/${articleID}`}