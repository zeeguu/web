import { useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { LEARNING_CYCLE } from "../exercises/ExerciseTypeConstants";
import CollapsablePanel from "../components/CollapsablePanel";
import LocalStorage from "../assorted/LocalStorage";
import Feature from "../features/Feature";

export default function Learning({ api }) {
  const [inLearningWords, setInLearningWords] = useState(null);
  const [toLearnWords, setToLearnWords] = useState(null);

  function get_bookmark_in_cycle(cycle) {
    if (!inLearningWords) return [];
    return inLearningWords.filter((word) => word.learning_cycle === cycle);
  }

  const receptiveWords = get_bookmark_in_cycle(LEARNING_CYCLE.RECEPTIVE);
  const productiveWords = get_bookmark_in_cycle(LEARNING_CYCLE.PRODUCTIVE);

  useEffect(() => {
    api.getUserBookmarksInPipeline((bookmarks) => {
      setInLearningWords(bookmarks);
    });
    api.getBookmarksToLearn((bookmarks) => {
      setToLearnWords(bookmarks);
    });
    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    if (bookmark.learning_cycle === LEARNING_CYCLE.NOT_SET) {
      let newWords = [...toLearnWords].filter((b) => b.id !== bookmark.id);
      setToLearnWords(newWords);
    } else {
      let newWords = [...inLearningWords].filter((b) => b.id !== bookmark.id);
      setInLearningWords(newWords);
    }
  }

  if (!receptiveWords || !productiveWords || !toLearnWords) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <CollapsablePanel
        topMessage={Feature.merle_exercises() ? "Receptive" : "In Learning"}
      >
        {Feature.merle_exercises() && (
          <>
            <s.TopMessage>
              <div className="top-message-icon">
                <img
                  src="/static/icons/receptive-icon.png"
                  alt="Receptive Icon"
                  style={{
                    height: "2.5em",
                    width: "2.5em",
                    margin: "0.5em",
                  }}
                />
                {strings.receptiveMsg}
              </div>
            </s.TopMessage>
            {receptiveWords && receptiveWords.length > 0 ? (
              receptiveWords.map((each) => (
                <Word
                  key={each.id}
                  bookmark={each}
                  api={api}
                  source={UMR_SOURCE}
                  notifyDelete={onNotifyDelete}
                />
              ))
            ) : (
              <s.TopMessage>{strings.noReceptiveWords}</s.TopMessage>
            )}
          </>
        )}

        {!Feature.merle_exercises() && (
          <>
            {inLearningWords && inLearningWords.length > 0 ? (
              inLearningWords.map((each) => (
                <Word
                  key={each.id}
                  bookmark={each}
                  api={api}
                  source={UMR_SOURCE}
                  notifyDelete={onNotifyDelete}
                />
              ))
            ) : (
              <s.TopMessage>{strings.noReceptiveWords}</s.TopMessage>
            )}
          </>
        )}
      </CollapsablePanel>
      <br />
      {Feature.merle_exercises() && (
        <>
          <CollapsablePanel topMessage="Productive">
            <s.TopMessage>
              <div className="top-message-icon">
                <img
                  src="/static/icons/productive-icon.png"
                  alt="Productive Icon"
                  style={{ height: "2.5em", width: "2.5em", margin: "0.5em" }}
                />
                {strings.productiveMsg}
              </div>
            </s.TopMessage>

            {!LocalStorage.getProductiveExercisesEnabled() && (
              <s.TopMessage>{strings.productiveDisableMsg}</s.TopMessage>
            )}
            {productiveWords.length === 0 &&
            LocalStorage.getProductiveExercisesEnabled() ? (
              <s.TopMessage>{strings.noProductiveWords}</s.TopMessage>
            ) : (
              productiveWords.map((each) => (
                <Word
                  key={each.id}
                  bookmark={each}
                  api={api}
                  source={UMR_SOURCE}
                  notifyDelete={onNotifyDelete}
                />
              ))
            )}
          </CollapsablePanel>
          <br />
        </>
      )}

      <CollapsablePanel topMessage="Not Yet In Study">
        {toLearnWords.length === 0 ? (
          <s.TopMessage>{strings.noToLearnWords}</s.TopMessage>
        ) : (
          <>
            <s.TopMessage>
              <div className="top-message-icon">{strings.toLearnMsg}</div>
            </s.TopMessage>
            {toLearnWords.map((each) => (
              <Word
                key={each.id}
                bookmark={each}
                api={api}
                source={UMR_SOURCE}
                notifyDelete={onNotifyDelete}
              />
            ))}
          </>
        )}
      </CollapsablePanel>
    </>
  );
}
