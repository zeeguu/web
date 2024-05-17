import { useState } from "react";

import { WordsOnDate } from "./WordsOnDate";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";
import * as sc from "../components/ColumnWidth.sc";

import * as s from "../components/TopMessage.sc";
import { setTitle } from "../assorted/setTitle";

export default function ReadingHistory({ api }) {
  const [wordsByDay, setWordsByDay] = useState(null);

  function deleteBookmark(bookmark) {
    console.log("Updating wordsBy Day!");
    let newBookmarksByDay = [...wordsByDay];
    for (let i = 0; i < wordsByDay.length; i++) {
      let bookmarks_for_day = wordsByDay[i].bookmarks;
      let newWords = [...bookmarks_for_day].filter((e) => e.id !== bookmark.id);
      newBookmarksByDay[i].bookmarks = newWords;
    }
    setWordsByDay(newBookmarksByDay);
  }

  if (!wordsByDay) {
    api.getBookmarksByDay((bookmarks_by_day) => {
      setWordsByDay(bookmarks_by_day);
      console.log(bookmarks_by_day);
    });

    setTitle(strings.titleTranslationHistory);
    return <LoadingAnimation />;
  }

  return (
    <sc.NarrowColumn>
      <br />
      <br />
      <s.TopMessage>{strings.starAWordMsg}</s.TopMessage>
      {wordsByDay.map((day) => (
        <WordsOnDate
          key={day.date}
          day={day}
          api={api}
          notifyDelete={deleteBookmark}
        />
      ))}
    </sc.NarrowColumn>
  );
}
