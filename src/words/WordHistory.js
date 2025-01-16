import { useState } from "react";

import { WordsOnDate } from "./WordsOnDate";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";
import * as sc from "../components/ColumnWidth.sc";
import { setTitle } from "../assorted/setTitle";
import { PageTitle } from "../components/PageTitle";
import * as s from "../components/TopMessage.sc";
import { StyledButton } from "../components/allButtons.sc";
import { useHistory } from "react-router-dom";

export default function ReadingHistory({ api }) {
  const [wordsByDay, setWordsByDay] = useState(null);

  function onNotifyDelete(bookmark) {
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
    });

    setTitle(strings.titleTranslationHistory);
    return <LoadingAnimation />;
  }

  return (
    <sc.NarrowColumn>
      <br />
      <br />
      <PageTitle>{strings.wordHistoryTitle}</PageTitle>
      {wordsByDay.length === 0 && (
        <>
          <s.TopMessage>
            <p>{strings.noWordsInHistory}</p>
            <p>{strings.happyLearning}</p>
          </s.TopMessage>
        </>
      )}
      {wordsByDay.map((day) => (
        <WordsOnDate
          key={day.date}
          day={day}
          api={api}
          notifyDelete={onNotifyDelete}
        />
      ))}
    </sc.NarrowColumn>
  );
}
