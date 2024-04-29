import { useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { UMR_SOURCE } from "../reader/ArticleReader";

export default function Productive({ api }) {
  const [words, setWords] = useState(null);
  const [productiveExercisesEnabled, setProductiveExercisesEnabled] =
    useState();

  useEffect(() => {
    api.getUserBookmarksToStudy(300, (bookmarks) => {
      const productiveWords = bookmarks.filter(
        (word) => word.learning_cycle === 2,
      );
      setWords(productiveWords);
    });
    setTitle(strings.titleProductiveWords);
  }, [api]);

  useEffect(() => {
    const productiveExercisesEnabled = localStorage.getItem(
      "productiveExercisesEnabled",
    );
    if (productiveExercisesEnabled) {
      setProductiveExercisesEnabled(JSON.parse(productiveExercisesEnabled));
    }
  }, []);

  if (!words) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <s.TopMessage>
        <img
          src="/static/icons/productive-icon.png"
          alt="Productive Icon"
          style={{ height: "2.5em", width: "2.5em", margin: "0.5em" }}
        />
        {strings.productiveMsg}
      </s.TopMessage>
      {productiveExercisesEnabled === false && (
        <s.TopMessage>{strings.productiveDisableMsg}</s.TopMessage>
      )}
      {words.length === 0 && productiveExercisesEnabled === true ? (
        <s.TopMessage>{strings.noProductiveWords}</s.TopMessage>
      ) : (
        words.map((each) => (
          <Word key={each.id} bookmark={each} api={api} source={UMR_SOURCE} />
        ))
      )}
    </>
  );
}
