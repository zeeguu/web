import strings from "../../i18n/definitions";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";
import WordBreakdown from "./WordBreakdown";

export default function FeedbackView({ accuracyResult, userSpeech }) {
  if (!accuracyResult) return null;

  return (
    <s.ResultSection id="resultSection">
      <h4>{strings.verbalFlashcardsYourAttempt}</h4>
      <s.UserSpeech>{userSpeech || strings.verbalFlashcardsNoSpeechDetected}</s.UserSpeech>

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

      <WordBreakdown wordMatches={accuracyResult.wordMatches} />
    </s.ResultSection>
  );
}
