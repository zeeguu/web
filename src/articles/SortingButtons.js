import { useState } from "react";
import * as s from "./SortingButtons.sc";

export default function SortingButtons({
  articleList,
  setArticleList,
  originalList,
}) {
  const [currentSort, setCurrentSort] = useState("");
  const [wordCountSortState, setwordCountSortState] = useState("");

  function sortArticleList(sorting) {
    setArticleList([...articleList].sort(sorting));
  }

  function changeDifficultySorting(
    e,
    currentSort,
    setCurrentSort,
    setOtherSort,
    sortingFunction
  ) {
    if (currentSort === "flip clicked") {
      sortArticleList(sortingFunction);
      setCurrentSort("clicked");
      setOtherSort("");
    } else if (currentSort === "clicked") {
      setArticleList(originalList);
      setCurrentSort("");
    } else {
      sortArticleList((a, b) => 0 - sortingFunction(a, b));
      setCurrentSort("flip clicked");
      setOtherSort("");
    }
  }

  return (
    <s.SortingButtons>
      Sort by:
      <button
        className={"sortContainer " + wordCountSortState}
        onClick={(e) =>
          changeDifficultySorting(
            e,
            wordCountSortState,
            setwordCountSortState,
            setCurrentSort,
            (a, b) => b.metrics.word_count - a.metrics.word_count
          )
        }
      >
        Words
      </button>
      <button
        className={"sortContainer " + currentSort}
        onClick={(e) =>
          changeDifficultySorting(
            e,
            currentSort,
            setCurrentSort,
            setwordCountSortState,
            (a, b) => b.metrics.difficulty - a.metrics.difficulty
          )
        }
      >
        Difficulty
      </button>
    </s.SortingButtons>
  );
}
