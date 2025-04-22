import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import Word from "./Word";

import * as s from "../components/TopMessage.sc";
import strings from "../i18n/definitions";
import { WEB_READER } from "../reader/ArticleReader";

export default function Starred({ api }) {
  const [words, setWords] = useState(null);

  useEffect(() => {
    api.starredBookmarks(30, (starredWords) => {
      setWords(starredWords);
    });
    setTitle(strings.titleStarredWords);
    // eslint-disable-next-line
  }, []);

  if (!words) {
    return <LoadingAnimation />;
  }

  if (words.length === 0) {
    return <s.TopMessage>{strings.noStarredMsg}</s.TopMessage>;
  }

  function bookmarkHasBeenUnstared(bookmark) {
    setWords(words.filter((w) => w.id !== bookmark.id));
  }

  return (
    <>
      {words.map((bookmark) => (
        <Word key={bookmark.id} bookmark={bookmark} notifyUnstar={bookmarkHasBeenUnstared} source={WEB_READER} />
      ))}
    </>
  );
}
