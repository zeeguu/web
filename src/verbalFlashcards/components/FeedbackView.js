import strings from "../../i18n/definitions";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function FeedbackView({ accuracyResult }) {
  if (!accuracyResult) return null;

  return (
    <s.ResultSection id="resultSection">
      <s.FeedbackContainer>
        <s.AccuracyMeter>
          <s.AccuracyLabel>{strings.verbalFlashcardsAccuracy}</s.AccuracyLabel>
          <s.ProgressBar>
            <s.ProgressFill $accuracy={accuracyResult.accuracy} style={{ width: `${accuracyResult.accuracy}%` }} />
          </s.ProgressBar>
          <s.AccuracyPercentage>{accuracyResult.accuracy}%</s.AccuracyPercentage>
        </s.AccuracyMeter>

        <s.FeedbackMessage $feedbackType={accuracyResult.isAccepted ? "success" : "warning"}>
          {accuracyResult.feedback}
        </s.FeedbackMessage>
      </s.FeedbackContainer>
    </s.ResultSection>
  );
}
