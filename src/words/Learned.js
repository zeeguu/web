import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";

export default function Learned({ api }) {
  const [words, setWords] = useState(null);
  const [totalWordsLearned, setTotalWordsLearned] = useState(0);

  function groupByDate(learnedWords) {
    if (learnedWords.length === 0) return learnedWords;
    let curDate = learnedWords[0].learned_datetime;
    let groupListByDate = [];
    let currentGroup = [];
    for (let i = 0; i < learnedWords.length; i++) {
      let curWord = learnedWords[i];
      if (curWord.learned_datetime === curDate) {
        currentGroup.push(curWord);
      } else {
        groupListByDate.push(currentGroup);
        currentGroup = [curWord];
        curDate = curWord.learned_datetime;
      }
    }
    // Push the last date
    groupListByDate.push(currentGroup);

    return groupListByDate;
  }

  useEffect(() => {
    api.learnedBookmarks(300, (learnedWords) => {
      setWords(groupByDate(learnedWords));
      setTotalWordsLearned(learnedWords.length);
    });
    setTitle(strings.titleLearnedWords);
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
      <s.TopMessage>{strings.learnedWordsAreMsg}</s.TopMessage>

      <s.TopMessage>
        {strings.formatString(
          strings.numberOfLearnedWordsMsg,
          totalWordsLearned,
        )}
      </s.TopMessage>
      <div>
        {words.map((subGroup) => {
          return (
            <div>
              <h2>{"Learned on: " + subGroup[0].learned_datetime}</h2>
              {subGroup.map((each) => {
                return (
                  <Word
                    key={each.id}
                    notifyDelete={onNotifyDelete}
                    bookmark={each}
                    api={api}
                    hideStar={true}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
