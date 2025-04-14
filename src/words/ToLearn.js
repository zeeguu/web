import { useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { WEB_READER } from "../reader/ArticleReader";

export default function ToLearn({ api }) {
  const [words, setWords] = useState(null);

  useEffect(() => {
    api.getBookmarksToLearn(false, (bookmarks) => {
      setWords(bookmarks);
    });
    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    let newWords = [...words].filter((e) => e.id !== bookmark.id);
    setWords(newWords);
  }

  if (!words) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <s.TopMessage>
        <div className="top-message-icon">{strings.toLearnMsg}</div>
      </s.TopMessage>
      {words.length === 0 ? (
        <s.TopMessage>{strings.noToLearnWords}</s.TopMessage>
      ) : (
        words.map((each) => <Word key={each.id} bookmark={each} source={WEB_READER} notifyDelete={onNotifyDelete} />)
      )}
    </>
  );
}
