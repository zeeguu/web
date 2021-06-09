import { Fragment, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import NonStudiedWordCard from "./NonStudiedWordCard";

const NonStudiedWordsList = ({ words }) => {
  const [nonStudiedWords, setNonStudiedWords] = useState([]);
  const wordsNotYetScheduled = nonStudiedWords.filter((word) => word.fit_for_study === 1);
  const wordsExcludedByAlgorithm = nonStudiedWords.filter((word) => word.fit_for_study === null);

  useEffect(() => {
    let tempList = [];
    words.reverse().forEach((word) => {
      if (tempList.length === 0) {
        tempList.push(word);
      } else {
        const lastIndex = tempList.length - 1;
        const lastWord = tempList[lastIndex].word.toLowerCase();
        if (!lastWord.includes(word.word.toLowerCase())) {
          tempList.push(word);
        }
      }
    });

    setNonStudiedWords(tempList.reverse());
    //eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      {words.length === 0 && (
        <p style={{ fontSize: "medium" }}>
          The student hasn't looked up any words yet. STRINGS
        </p>
      )}
      {wordsExcludedByAlgorithm.map((word) => (
        <NonStudiedWordCard key={word + uuid()} word={word} />
      ))}
      {wordsNotYetScheduled.map((word) => (
        <NonStudiedWordCard key={word + uuid()} word={word} />
      ))}
    </Fragment>
  );
};
export default NonStudiedWordsList;
