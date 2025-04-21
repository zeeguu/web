import { useContext, useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { WEB_READER } from "../reader/ArticleReader";
import { LEARNING_CYCLE } from "../exercises/ExerciseTypeConstants";
import CollapsablePanel from "../components/CollapsablePanel";
import Feature from "../features/Feature";

import { APIContext } from "../contexts/APIContext";

export default function Learning() {
  const api = useContext(APIContext);

  const [inLearning, setInLearning] = useState(null);
  const [inLearning_byLevel, setInLearning_byLevel] = useState(null);
  const [toLearn, setToLearn] = useState(null);

  useEffect(() => {
    api.getUserBookmarksInPipeline(false, (bookmarks) => {
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
    api.getBookmarksToLearn(false, (bookmarks) => {
      setToLearn(bookmarks);
    });
    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    if (bookmark.learning_cycle === LEARNING_CYCLE.NOT_SET) {
      let newWords = [...toLearn].filter((b) => b.id !== bookmark.id);
      setToLearn(newWords);
    } else {
      let newWords = [...inLearning].filter((b) => b.id !== bookmark.id);
      setInLearning(newWords);
    }
  }

  if (!toLearn || !inLearning) {
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
      <h1>In Learning</h1>
      <>
        {inLearning.length === 0 && <p>No words being learned yet</p>}

        {[4, 3, 2, 1, 0].map((level) => (
          <>
            {inLearning_byLevel[level].length > 0 && (
              <CollapsablePanel topMessage={topMessage(level, inLearning_byLevel[level].length)}>
                {inLearning_byLevel[level].map((each) => (
                  <Word key={each.id} bookmark={each} source={WEB_READER} notifyDelete={onNotifyDelete} />
                ))}
              </CollapsablePanel>
            )}
          </>
        ))}
      </>

      <br />

      <CollapsablePanel topMessage="Not Yet In Study">
        {toLearn.length > 0 && (
          <s.TopMessage>
            <div className="top-message-icon">
              {Feature.merle_exercises() ? strings.toLearnMsgLearningCycles : strings.toLearnMsg}
            </div>
          </s.TopMessage>
        )}

        {toLearn.length === 0 ? (
          <s.TopMessage>{strings.noToLearnWords}</s.TopMessage>
        ) : (
          <>
            {toLearn.map((each) => (
              <Word
                key={each.id}
                bookmark={each}
                source={WEB_READER}
                notifyDelete={onNotifyDelete}
                showRanking={true}
              />
            ))}
          </>
        )}
      </CollapsablePanel>
    </>
  );
}
