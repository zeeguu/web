import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { useState } from "react";
import GiveFeedbackModal from "../GiveFeedbackModal";

export default function SolutionFeedbackLinks({
  api,
  handleShowSolution,
  toggleShow,
  isCorrect,
}) {
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <s.CenteredRow>
      <GiveFeedbackModal
        open={openFeedback}
        setOpen={setOpenFeedback}
      ></GiveFeedbackModal>
      {!isCorrect && (
        <>
          <s.StyledGreyButton
            className="styledGreyButton"
            onClick={handleShowSolution}
          >
            {strings.showSolution}
          </s.StyledGreyButton>
          <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
        </>
      )}
      <s.StyledGreyButton className="styledGreyButton" onClick={toggleShow}>
        {strings.dontShowThisWordAgain}
      </s.StyledGreyButton>
      <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
      <s.StyledGreyButton
        className="styledGreyButton"
        onClick={() => {
          setOpenFeedback(!openFeedback);
        }}
      >
        {strings.giveFeedback}
      </s.StyledGreyButton>
    </s.CenteredRow>
  );
}
