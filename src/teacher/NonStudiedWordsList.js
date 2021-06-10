import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import LocalStorage from "../assorted/LocalStorage";
import NonStudiedWordCard from "./NonStudiedWordCard";

const NonStudiedWordsList = ({ api }) => {
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [nonStudiedWords, setNonStudiedWords] = useState([]);
  const wordsNotYetScheduled = nonStudiedWords.filter(
    (word) => word.fit_for_study === 1
  );
  const wordsExcludedByAlgorithm = nonStudiedWords.filter(
    (word) => word.fit_for_study === null
  );

  useEffect(() => {
    api.getNonStudiedWords(
      studentID,
      selectedTimePeriod,
      cohortID,
      (nonStudiedWordsInDB) => {
        setNonStudiedWords(nonStudiedWordsInDB);
      },
      (error) => {
        console.log(error);
      }
    );
    //eslint-disable-next-line
  }, [selectedTimePeriod]);

  return (
    <Fragment>
      {nonStudiedWords.length === 0 && (
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
