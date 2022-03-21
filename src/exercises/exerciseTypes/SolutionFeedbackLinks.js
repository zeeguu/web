import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";

export default function SolutionFeedbackLinks({
  handleShowSolution,
  toggleShow,
  isCorrect,
}) {
  return (
    <s.CenteredRow>
      {!isCorrect && (
        <>
          <s.StyledGreyButton onClick={handleShowSolution}>
            {strings.showSolution}
          </s.StyledGreyButton>
          <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
        </>
      )}
      <s.StyledGreyButton onClick={toggleShow}>
        {strings.giveFeedback}
      </s.StyledGreyButton>
    </s.CenteredRow>
  );
}
