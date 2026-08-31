import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Selector from "../components/Selector";
import * as s from "./SortingButtons.sc";

// Sorts available everywhere. `progress` needs reading state and `added` needs
// a published date, so both are offered only where the list carries them.
const BASE_SORTS = [
  { value: "", label: "Sort: none" },
  { value: "level-asc", label: "Level ↑" },
  { value: "level-desc", label: "Level ↓" },
  { value: "length-asc", label: "Length ↑" },
  { value: "length-desc", label: "Length ↓" },
  { value: "title-asc", label: "Title A–Z" },
];

const PROGRESS_SORTS = [
  { value: "progress-asc", label: "Progress ↑" },
  { value: "progress-desc", label: "Progress ↓" },
];

const DATE_SORTS = [
  { value: "added-desc", label: "Newest first" },
  { value: "added-asc", label: "Oldest first" },
];

function readingCompletion(article) {
  // An unopened article gets a negative value so it sorts first.
  const openAdjustment = article.opened ? 0 : 0.1;
  return article.reading_completion ? article.reading_completion : 0 - openAdjustment;
}

function publishedAt(article) {
  return article.published ? new Date(article.published).getTime() : 0;
}

function lengthOf(article) {
  return article.video ? article.duration : article.metrics?.word_count;
}

const COMPARATORS = {
  "level-asc": (a, b) => a.metrics.difficulty - b.metrics.difficulty,
  "level-desc": (a, b) => b.metrics.difficulty - a.metrics.difficulty,
  "length-asc": (a, b) => lengthOf(a) - lengthOf(b),
  "length-desc": (a, b) => lengthOf(b) - lengthOf(a),
  "title-asc": (a, b) => a.title.localeCompare(b.title),
  "progress-asc": (a, b) => readingCompletion(a) - readingCompletion(b),
  "progress-desc": (a, b) => readingCompletion(b) - readingCompletion(a),
  "added-desc": (a, b) => publishedAt(b) - publishedAt(a),
  "added-asc": (a, b) => publishedAt(a) - publishedAt(b),
};

export default function SortingButtons({ articleList, setArticleList, clearStateTrigger }) {
  const [sortOption, setSortOption] = useState("");
  const [originalList, setOriginalList] = useState([]);
  const path = useLocation().pathname;
  const isOnTeacherSite = path.includes("teacher");
  const isOnSavedArticles = path.includes("ownTexts");

  useEffect(() => {
    setSortOption("");
    setOriginalList([]);
  }, [clearStateTrigger]);

  useEffect(() => {
    if (sortOption && originalList.length === 0) {
      setOriginalList([...articleList]);
    }
  }, [articleList, sortOption, originalList]);

  const options = [
    ...BASE_SORTS,
    ...(isOnTeacherSite ? DATE_SORTS : []),
    ...(isOnSavedArticles ? PROGRESS_SORTS : []),
  ];

  function handleSortSelect(value) {
    setSortOption(value);

    if (!value) {
      if (originalList.length > 0) setArticleList([...originalList]);
      return;
    }

    if (originalList.length === 0) setOriginalList([...articleList]);
    setArticleList([...articleList].sort(COMPARATORS[value]));
  }

  return (
    <s.SortingButtons $isOnTeacherSite={isOnTeacherSite}>
      <Selector
        options={options}
        optionLabel={(option) => option.label}
        optionValue={(option) => option.value}
        selectedValue={sortOption}
        onChange={(event) => handleSortSelect(event.target.value)}
        ariaLabel="Sort the list"
        showPlaceholder={false}
      />
    </s.SortingButtons>
  );
}
