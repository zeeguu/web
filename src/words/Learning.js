import { useContext, useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import { WEB_READER } from "../reader/ArticleReader";
import CollapsablePanel from "../components/CollapsablePanel";

import { APIContext } from "../contexts/APIContext";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";

export default function Learning() {
  const api = useContext(APIContext);
  const exerciseNotification = useContext(ExerciseCountContext);

  const [inLearning, setInLearning] = useState(null);
  const [inLearning_byLevel, setInLearning_byLevel] = useState(null);

  useEffect(() => {
    api.getScheduledBookmarks(false, (bookmarks) => {
      setInLearning(bookmarks);

      let words_byLevel = { 0: [], 1: [], 2: [], 3: [], 4: [] };
      bookmarks.forEach((word) => {
        words_byLevel[word.level] = [...words_byLevel[word.level], word];
      });

      // Order by rank within the levels
      [4, 3, 2, 1, 0].forEach((level) => {
        words_byLevel[level] = words_byLevel[level].sort((a, b) => a.origin_rank - b.origin_rank);
      });

      setInLearning_byLevel(words_byLevel);
    });

    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    let newWords = [...inLearning].filter((b) => b.id !== bookmark.id);
    setInLearning(newWords);

    exerciseNotification.fetchAndUpdate();
  }

  if (!inLearning || !inLearning_byLevel) {
    return <LoadingAnimation />;
  }

  function topMessage(level, count) {
    return (
      <>
        Level {level} <span style={{ color: "gray", fontWeight: "lighter" }}>({count})</span>
      </>
    );
  }

  return (
    <>
      <h1>In Learning ({inLearning.length})</h1>
      <>
        {inLearning.length === 0 && <p>No words being learned yet</p>}

        {[4, 3, 2, 1, 0].map((level) => (
          <>
            {inLearning_byLevel[level].length > 0 && (
              <CollapsablePanel key={level} topMessage={topMessage(level, inLearning_byLevel[level].length)}>
                {inLearning_byLevel[level].map((each) => (
                  <Word
                    key={each.id}
                    bookmark={each}
                    source={WEB_READER}
                    notifyDelete={onNotifyDelete}
                    showRanking={true}
                  />
                ))}
              </CollapsablePanel>
            )}
          </>
        ))}
      </>

      <br />
    </>
  );
}
