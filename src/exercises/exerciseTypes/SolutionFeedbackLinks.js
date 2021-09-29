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
          <s.StyledLink to={"#"} onClick={handleShowSolution}>
            {strings.showSolution}
          </s.StyledLink>
          <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
        </>
      )}
      <s.StyledLink to={"#"} onClick={toggleShow}>
        {strings.giveFeedback}
      </s.StyledLink>
    </s.CenteredRow>
  );
}
