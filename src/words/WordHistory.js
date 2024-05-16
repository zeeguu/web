import { useState } from "react";

import { WordsOnDate } from "./WordsOnDate";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";
import * as sc from "../components/ColumnWidth.sc";

import * as s from "../components/TopMessage.sc";
import { setTitle } from "../assorted/setTitle";
import Infobox from "../components/Infobox";

export default function ReadingHistory({ api }) {
  const [wordsByDay, setWordsByDay] = useState(null);

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
      <Infobox>{strings.starAWordMsg}</Infobox>
      {wordsByDay.map((day) => (
        <WordsOnDate key={day.date} day={day} api={api} />
      ))}
    </sc.NarrowColumn>
  );
}
