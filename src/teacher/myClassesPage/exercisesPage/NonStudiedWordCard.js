import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/NonStudiedWordCard.sc";

const NonStudiedWordCard = ({ word }) => {
  const exclusionReason = () => {
    if (word.fit_for_study === null) {
      return (
        <s.StyledNonStudiesWordCard>
          <p className="red-reason">
            {strings.excludedByAlgorithm}
          </p>
        </s.StyledNonStudiesWordCard>
      );
    }
    return (
      <s.StyledNonStudiesWordCard>
        <p className="grey-reason">
          {strings.scheduledNotYetStudied}
        </p>
      </s.StyledNonStudiesWordCard>
    );
  };

  return (
    <s.StyledNonStudiesWordCard>
      <div className="non-studied-word-container">
        <p className="non-studied-word">
          <b>{word.word}</b>
        </p>
        <p className="non-studied-word-translation">
          {word.translation.toLowerCase()}
        </p>
        {exclusionReason(word)}
      </div>
    </s.StyledNonStudiesWordCard>
  );
};
export default NonStudiedWordCard;
