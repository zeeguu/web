import { useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";

export default function Top({ api }) {
  const [words, setWords] = useState(null);

  useEffect(() => {
    api.topBookmarks(300, (topWords) => {
      setWords(topWords);
    });
    setTitle(strings.titleRankedWords);
  }, [api]);

  if (!words) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <s.TopMessage>{strings.rankedMsg}</s.TopMessage>

      {words.map((each) => (
        <Word key={each.id} bookmark={each} api={api} />
      ))}
    </>
  );
}
