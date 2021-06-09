import { Fragment, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import NonStudiedWordCard from "./NonStudiedWordCard";

const NonStudiedWordsList = ({ words }) => {
  const wordsNotYetScheduled = words.filter((word) => word.fit_for_study === 1);
  const wordsExcludedByAlgorithm = words.filter((word) => word.fit_for_study === null);
  const [nonStudiedWords, setNonStudiedWords] = useState([]);

  useEffect(() => {
    let tempList = [];
    wordsNotYetScheduled.forEach((word) => {
      tempList.push(word);
    });
    wordsExcludedByAlgorithm.reverse().forEach((word) => {
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
      {nonStudiedWords.map((word) => (
        <NonStudiedWordCard key={word + uuid()} word={word} />
      ))}
    </Fragment>
  );
};
export default NonStudiedWordsList;
