import Modal from "@mui/material/Modal";
import * as s from "./ExtensionMessage.sc";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";

export default function QuestionnaireMessage({
  open,
  displayedAudioExperimentQuestionnaire,
  setDisplayedAudioExperimentQuestionnaire,
  setQuestionnaireMessageOpen,
}) {
  function handleClose() {
    setQuestionnaireMessageOpen(false);
    setDisplayedAudioExperimentQuestionnaire(true);
    LocalStorage.setDisplayedAudioExperimentQuestionnaire(true);
  }

  if (Feature.audio_exercises() && !displayedAudioExperimentQuestionnaire && LocalStorage.checkAudioExperimentCompleted()) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <s.MyBox>
          <s.StyledCloseButton role="button" onClick={handleClose}>
            X
          </s.StyledCloseButton>
          <h1>{strings.questionnaireMessageHeadline}</h1>
          <p>
            {strings.questionnaireMessageText}
            <br /> <br />
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeUMh8wJCGU6dd84zqKQBp6wpZim4gYOrXWoVkmlEafanS7Mw/viewform?usp=sf_link" 
              rel="noopener noreferrer" target="_blank">
                  {strings.questionnaireLinkText}
            </a>
          </p>
          
        </s.MyBox>
      </Modal>
    );
  } else return null;
}
