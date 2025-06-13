import { useContext, useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";

export default function Learned() {
  const api = useContext(APIContext);
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
    api.totalLearnedBookmarks((totalLearnedCount) => {
      setTotalWordsLearned(totalLearnedCount);
    });
    api.learnedBookmarks(300, (learnedWords) => {
      setWords(groupByDate(learnedWords));
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
      <s.YellowMessageBox>
        <br />
        <div>
          {totalWordsLearned > 10 ? "Congratulations! " : " "}
          You have learned <b>{totalWordsLearned}</b> words so far.
        </div>
        <br />
        <div style={{ textAlign: "left", marginLeft: "1em", fontSize: "smaller" }}>
          A word is learned when done correctly in exercises in all the four levels. Or when it is marked as{" "}
          <i>"too easy"</i> by you after you have done several exercises with it.
        </div>

        <br />
      </s.YellowMessageBox>
      <div>
        {words.map((subGroup) => {
          return (
            <div>
              {subGroup.map((each) => {
                return <Word key={each.id} notifyDelete={onNotifyDelete} bookmark={each} hideStar={true} />;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
