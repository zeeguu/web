import { useState } from "react";
import { useLocation } from "react-router";
import strings from "../i18n/definitions";
import * as s from "./SortingButtons.sc";

export default function SortingButtons({
  articleList,
  setArticleList,
  originalList,
}) {
  const [difficultySortState, setDifficultySortState] = useState("");
  const [wordCountSortState, setWordCountSortState] = useState("");
  const [progressSortState, setProgressSortState] = useState("");
  const isOnTeacherSite = useLocation().pathname.includes("teacher");
  const isOnSavedArticles = useLocation().pathname.includes("ownTexts");

  function getReadingCompletion(article) {
    // If the article wasn't open give a negative value so they are first in the list.
    let openAdjustment = article.opened ? 0 : 0.1;
    return article.reading_completion
      ? article.reading_completion
      : 0 - openAdjustment;
  }
  function sortArticleList(sorting) {
    setArticleList([...articleList].sort(sorting));
    for (let i; i < articleList.length; i++) {
      console.log(articleList[i]);
    }
  }

  function changeDifficultySorting(
    e,
    currentSort,
    setCurrentSort,
    otherSetters,
    sortingFunction,
  ) {
    if (currentSort === "ascending") {
      sortArticleList(sortingFunction);
      setCurrentSort("descending");
    } else if (currentSort === "descending") {
      setArticleList(originalList);
      setCurrentSort("");
    } else {
      sortArticleList((a, b) => 0 - sortingFunction(a, b));
      setCurrentSort("ascending");
    }
    otherSetters.forEach((setter) => setter(""));
  }

  return (
    <s.SortingButtons isOnTeacherSite={isOnTeacherSite}>
      <div className="sort-by"> {strings.sortBy}&nbsp; </div>
      <s.SortButton
        isOnTeacherSite={isOnTeacherSite}
        className={difficultySortState}
        onClick={(e) =>
          changeDifficultySorting(
            e,
            difficultySortState,
            setDifficultySortState,
            [setWordCountSortState, setProgressSortState],
            (a, b) => b.metrics.difficulty - a.metrics.difficulty,
          )
        }
      >
        {strings.levelWithCapital}
      </s.SortButton>
      <s.SortButton
        isOnTeacherSite={isOnTeacherSite}
        className={wordCountSortState}
        onClick={(e) =>
          changeDifficultySorting(
            e,
            wordCountSortState,
            setWordCountSortState,
            [setDifficultySortState, setProgressSortState],
            (a, b) => b.metrics.word_count - a.metrics.word_count,
          )
        }
      >
        {strings.lengthWithCapital}
      </s.SortButton>
      {isOnSavedArticles && (
        <s.SortButton
          isOnTeacherSite={isOnTeacherSite}
          className={progressSortState}
          onClick={(e) =>
            changeDifficultySorting(
              e,
              progressSortState,
              setProgressSortState,
              [setDifficultySortState, setWordCountSortState],
              (a, b) => getReadingCompletion(b) - getReadingCompletion(a),
            )
          }
        >
          {strings.readingCompletion}
        </s.SortButton>
      )}
    </s.SortingButtons>
  );
}
