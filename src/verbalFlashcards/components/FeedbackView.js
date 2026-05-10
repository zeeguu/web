import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function FeedbackView({ accuracyResult }) {
  if (!accuracyResult) return null;

  return (
    <s.ResultSection id="resultSection">
      <s.FeedbackContainer>
        <s.FeedbackMessage $feedbackType={accuracyResult.isAccepted ? "success" : "warning"}>
          {accuracyResult.feedback}
        </s.FeedbackMessage>
      </s.FeedbackContainer>
    </s.ResultSection>
  );
}
