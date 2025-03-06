import { useContext, useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { APIContext } from "../contexts/APIContext";

export default function Top() {
  const api = useContext(APIContext);
  const [words, setWords] = useState();

  useEffect(() => {
    api.topBookmarks(300, (topWords) => {
      setWords(topWords);
    });
    setTitle(strings.titleRankedWords);
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
      <s.TopMessage>{strings.rankedMsg}</s.TopMessage>
      {words.map((each) => (
        <Word
          key={each.id}
          bookmark={each}
          source={UMR_SOURCE}
          notifyDelete={onNotifyDelete}
        />
      ))}
    </>
  );
}
