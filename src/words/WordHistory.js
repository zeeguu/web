import { useState } from "react";

import { WordsOnDate } from "./WordsOnDate";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import * as s from "../components/TopMessage.sc";
import { setTitle } from "../assorted/setTitle";

export default function WordHistory({ api }) {
  const [wordsByDay, setWordsByDay] = useState(null);

  if (!wordsByDay) {
    api.getBookmarksByDay((bookmarks_by_day) => {
      setWordsByDay(bookmarks_by_day);
    });

    setTitle(strings.titleTranslationHistory);
    return <LoadingAnimation />;
  }

  return (
    <>
      <s.TopMessage>
        {strings.starAWordMsg}
      </s.TopMessage>

      {wordsByDay.map((day) => (
        <WordsOnDate key={day.date} day={day} api={api} />
      ))}
    </>
  );
}
