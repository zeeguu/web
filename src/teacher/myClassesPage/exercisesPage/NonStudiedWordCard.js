import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/NonStudiedWordCard.sc";

const NonStudiedWordCard = ({ word }) => {
  const exclusionReason = () => {
    if (word.fit_for_study === null) {
      return (
        <s.StyledNonStudiesWordCard>
          <p className="excluded-by-algorithm-string">
            {strings.excludedByAlgorithm}
          </p>
        </s.StyledNonStudiesWordCard>
      );
    }
    return (
      <s.StyledNonStudiesWordCard>
        <p className="not-yet-studied-string">
          {strings.scheduledNotYetStudied}
        </p>
      </s.StyledNonStudiesWordCard>
    );
  };

  return (
    <s.StyledNonStudiesWordCard>
      <div className="non-studied-words-row">
        <p className="words-not-studied-translations">
          {word.translation.toLowerCase()}
        </p>
        <p className="words-not-studied">
          <b>{word.word}</b>
        </p>
        {exclusionReason(word)}
      </div>
    </s.StyledNonStudiesWordCard>
  );
};
export default NonStudiedWordCard;
