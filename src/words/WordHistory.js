import { useState, useEffect, useContext } from "react";

import { WordsOnDate } from "./WordsOnDate";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";
import * as sc from "../components/ColumnWidth.sc";
import { setTitle } from "../assorted/setTitle";
import { PageTitle } from "../components/PageTitle";
import Infobox from "../components/Infobox";
import { APIContext } from "../contexts/APIContext";

export default function ReadingHistory() {
  const api = useContext(APIContext);
  const [wordsByDay, setWordsByDay] = useState();

  function onNotifyDelete(bookmark) {
    let newBookmarksByDay = [...wordsByDay];
    for (let i = 0; i < wordsByDay.length; i++) {
      let bookmarks_for_day = wordsByDay[i].bookmarks;
      let newWords = [...bookmarks_for_day].filter((e) => e.id !== bookmark.id);
      newBookmarksByDay[i].bookmarks = newWords;
    }
    setWordsByDay(newBookmarksByDay);
  }

  useEffect(() => {
    api.getBookmarksByDay((bookmarks_by_day) => {
      console.log("bookmarks_by_day (JOHANNA)", bookmarks_by_day);
      setWordsByDay(bookmarks_by_day);
    });
    setTitle(strings.titleTranslationHistory);
  }, [api]);

  if (wordsByDay === undefined) {
    return <LoadingAnimation />;
  }
  console.dir(wordsByDay);
  return (
    <sc.NarrowColumn>
      <PageTitle>{strings.wordHistoryTitle}</PageTitle>
      {wordsByDay.length === 0 && (
        <Infobox>You don't have any translations yet.</Infobox>
      )}
      {wordsByDay.map((day) => (
        <WordsOnDate key={day.date} day={day} notifyDelete={onNotifyDelete} />
      ))}
    </sc.NarrowColumn>
  );
}
