import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";

export default function Learned({ api }) {
  const [words, setWords] = useState(null);

  useEffect(() => {
    api.learnedBookmarks(300, (learnedWords) => {
      setWords(learnedWords);
    });
    setTitle(strings.titleLearnedWords);
  }, [api]);

  if (!words) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <s.TopMessage>{strings.learnedWordsAreMsg}</s.TopMessage>

      <s.TopMessage>
        {strings.formatString(strings.numberOfLearnedWordsMsg, words.length)}
      </s.TopMessage>

      {words.map((each) => (
        <Word key={each.id} bookmark={each} api={api} hideStar={true}>
          <small>
            Correct on:
            {" " + each.learned_datetime}
            <br />
            <br />
          </small>
        </Word>
      ))}
    </>
  );
}
