import { useContext, useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import { WEB_READER } from "../reader/ArticleReader";
import CollapsablePanel from "../components/CollapsablePanel";

import { APIContext } from "../contexts/APIContext";
import { ExercisesCounterContext } from "../exercises/ExercisesCounterContext";

export default function Learning() {
  const api = useContext(APIContext);

  const { updateExercisesCounter } = useContext(ExercisesCounterContext);

  const [inLearning, setInLearning] = useState(null);
  const [inLearning_byLevel, setInLearning_byLevel] = useState(null);
  const [nextInLearning, setNextInLearning] = useState(false);

  useEffect(() => {
    api.getBookmarksAlreadyScheduled(false, (bookmarks) => {
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

    api.getBookmarksNextInLearning((bookmarks) => {
      setNextInLearning(bookmarks);
      console.log(bookmarks);
    });

    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    let newWords = [...inLearning].filter((b) => b.id !== bookmark.id);
    setInLearning(newWords);
    updateExercisesCounter();
  }

  if (!inLearning || !inLearning_byLevel || !nextInLearning) {
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
      <h1>
        In Learning <span style={{ color: "gray", fontWeight: "lighter" }}>({inLearning.length})</span>
      </h1>
      <p>
        Words you see in your exercises grouped by how far you've progressed them. Our spaced repetition algorithm
        decides the ones you see in a given day.
      </p>
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

      {nextInLearning.length > 0 && (
        <>
          <h1>Next in exercises...</h1>
          <p>
            When you master a word from your current exercise list, it gets replaced by a new word to keep your practice
            sessions consistent.
          </p>
          <p>
            The words below are ranked in order of their priority for being added to your exercises next. These
            replacement words come from your previous translation work and are prioritized based on how frequently they
            appear in the language you're learning.
          </p>
          {nextInLearning.map((each) => (
            <Word
              key={each.id}
              bookmark={each}
              source={WEB_READER}
              notifyDelete={onNotifyDelete}
              showRanking={true}
              isGrayedOut={true}
            />
          ))}
          <br />
          <br />
        </>
      )}
    </>
  );
}
