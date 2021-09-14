import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";

export default function SolutionFeedbackLinks({
  handleShowSolution,
  toggleShow,
  toggleShowImproveTranslation,
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
      {isCorrect && (
        <>
          <s.StyledLink to={"#"} onClick={toggleShowImproveTranslation}>
            {strings.improveTranslation}
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
