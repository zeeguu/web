import { Fragment } from "react";
import { v4 as uuid } from "uuid";
import NonStudiedWordCard from "./NonStudiedWordCard";

const NonStudiedWordsList = ({ words }) => {
  const wordsNotYetScheduled = words.filter((word) => word.fit_for_study === 1);
  const wordsExcludedByAlgorithm = words.filter((word) => word.fit_for_study === null);

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
