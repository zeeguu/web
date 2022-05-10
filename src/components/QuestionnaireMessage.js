import Modal from "@mui/material/Modal";
import * as s from "./ExtensionMessage.sc";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import { useEffect, useState } from "react";

export default function QuestionnaireMessage({
  api,
  articleID,
  source,
  displayedAudioExperimentQuestionnaire,
  setDisplayedAudioExperimentQuestionnaire,
}) {

  const [open, setAudioQuestionnaireMessageOpen] = useState(false);

  useEffect(() => {
    if(!LocalStorage.displayedAudioExperimentQuestionnaire()) {
      setAudioQuestionnaireMessageOpen(true);
    }
  }, [])

  function handleClose() {
    setAudioQuestionnaireMessageOpen(false);
    LocalStorage.setDisplayedAudioExperimentQuestionnaire(true);
    api.logUserActivity(api.AUDIO_EXP, articleID, "Closed questionnaire, send reminder", source);
  }

  if (Feature.audio_exercises() && !LocalStorage.displayedAudioExperimentQuestionnaire()) {
    return (
      <Modal
        articleID={articleID}
        api={api}
        source={source}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        displayedAudioExperimentQuestionnaire={displayedAudioExperimentQuestionnaire}
        setDisplayedAudioExperimentQuestionnaire={setDisplayedAudioExperimentQuestionnaire}
      >
        <s.MyBox>
          <s.StyledCloseButton role="button" onClick={handleClose}>
            X
          </s.StyledCloseButton>
          <h1>{strings.questionnaireMessageHeadline}</h1>
          <p>
            {strings.questionnaireMessageText}
            <br /> <br />
            <a onClick={handleClose} href="https://docs.google.com/forms/d/e/1FAIpQLSeUMh8wJCGU6dd84zqKQBp6wpZim4gYOrXWoVkmlEafanS7Mw/viewform?usp=sf_link" 
              rel="noopener noreferrer" target="_blank">
                  {strings.questionnaireLinkText}
            </a>
          </p>
          
        </s.MyBox>
      </Modal>
    );
  } else return null;
}
