import { useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { LEARNING_CYCLE } from "../exercises/ExerciseTypeConstants";
import CollapsablePanel from "../components/CollapsablePanel";
import Feature from "../features/Feature";

export default function Learning({ api }) {
  const [receptiveWords, setReceptiveWords] = useState(null);
  const [productiveWords, setProductiveWords] = useState(null);
  const [toLearnWords, setToLearnWords] = useState(null);
  const [productiveExercisesEnabled, setProductiveExercisesEnabled] =
    useState();

  useEffect(() => {
    api.getUserBookmarksInPipeline((bookmarks) => {
      const _receptiveWords = bookmarks.filter(
        (word) => word.learning_cycle === LEARNING_CYCLE.RECEPTIVE,
      );
      const _productiveWords = bookmarks.filter(
        (word) => word.learning_cycle === LEARNING_CYCLE.PRODUCTIVE,
      );
      setReceptiveWords(_receptiveWords);
      setProductiveWords(_productiveWords);
    });
    api.getBookmarksToLearn((bookmarks) => {
      setToLearnWords(bookmarks);
    });
    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    if (bookmark.learning_cycle === LEARNING_CYCLE.RECEPTIVE) {
      let newWords = [...receptiveWords].filter((b) => b.id !== bookmark.id);
      setReceptiveWords(newWords);
    } else if (bookmark.learning_cycle === LEARNING_CYCLE.PRODUCTIVE) {
      let newWords = [...productiveWords].filter((b) => b.id !== bookmark.id);
      setProductiveWords(newWords);
    } else if (bookmark.learning_cycle === LEARNING_CYCLE.NOT_SET) {
      let newWords = [...toLearnWords].filter((b) => b.id !== bookmark.id);
      setToLearnWords(newWords);
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
        )}

        {receptiveWords.length === 0 ? (
          <s.TopMessage>{strings.noReceptiveWords}</s.TopMessage>
        ) : (
          receptiveWords.map((each) => (
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

            {productiveExercisesEnabled === false && (
              <s.TopMessage>{strings.productiveDisableMsg}</s.TopMessage>
            )}
            {productiveWords.length === 0 &&
            productiveExercisesEnabled === true ? (
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
        {toLearnWords.length > 0 && (
          <s.TopMessage>
            <div className="top-message-icon">
              {Feature.merle_exercises()
                ? strings.toLearnMsgLearningCycles
                : strings.toLearnMsg}
            </div>
          </s.TopMessage>
        )}
        {toLearnWords.length === 0 ? (
          <s.TopMessage>{strings.noToLearnWords}</s.TopMessage>
        ) : (
          toLearnWords.map((each) => (
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
    </>
  );
}
