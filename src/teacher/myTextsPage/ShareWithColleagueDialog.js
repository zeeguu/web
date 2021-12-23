import { useState } from "react";
import strings from "../../i18n/definitions";
import { Error } from "../sharedComponents/Error";
import { LabeledTextField } from "../sharedComponents/LabeledInputFields";
import { StyledDialog } from "../styledComponents/StyledDialog.sc";
import {
  PopupButtonWrapper,
  StyledButton,
} from "../styledComponents/TeacherButtons.sc";

const ShareWithCollegueDialog = ({ api, articleID, setShowDialog }) => {
  const [receivingColleague, setReceivingColleague] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [articleSent, setArticleSent] = useState(false);

  function handleChange(event) {
    setErrorMsg("");
    setReceivingColleague(event.target.value);
  }

  function handleSuccess() {
    setReceivingColleague("");
    setArticleSent(true);
  }

  function shareText() {
    api.shareTextWithColleague(
      articleID,
      receivingColleague,
      (onSuccess) => {
        onSuccess === "OK"
          ? handleSuccess()
          : setErrorMsg(strings.somethingWentWrongMostLikelyEmail);
      },
      (error) => {
        setErrorMsg(strings.theConnectionFailed);
        console.log(error);
      }
    );
  }

  return (
    <StyledDialog
      aria-label="Choose classes"
      onDismiss={() => setShowDialog(false)}
      max_width="525px"
    >
      {articleSent ? (
        <div className="centered">
          <h1>{strings.shareWithColleague}</h1>
          <p>{strings.yourColleagueShouldHaveTheTextShortly}</p>
          <PopupButtonWrapper>
            <StyledButton primary onClick={() => setShowDialog(false)}>
              {strings.ok}
            </StyledButton>
          </PopupButtonWrapper>
        </div>
      ) : (
        <div className="centered">
          <h1>{strings.shareWithColleague}</h1>
          <LabeledTextField
            value={receivingColleague}
            onChange={handleChange}
            name={strings.enterEmailYourColleagueUse}
            placeholder={strings.colleagueEmailExample}
          >
            {strings.enterEmailYourColleagueUse}
          </LabeledTextField>
          <Error message={errorMsg} />
          <PopupButtonWrapper>
            <StyledButton primary onClick={() => setShowDialog(false)}>
              {strings.cancel}
            </StyledButton>
            <StyledButton secondary onClick={shareText}>
              {strings.share}
            </StyledButton>
          </PopupButtonWrapper>
        </div>
      )}
    </StyledDialog>
  );
};

export default ShareWithCollegueDialog;
