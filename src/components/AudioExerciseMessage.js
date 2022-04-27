import Modal from "@mui/material/Modal";
import * as s from "./ExtensionMessage.sc";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import * as t from "../exercises/exerciseTypes/Exercise.sc"

export default function AudioExerciseMessage({open, displayedAudioExercisePopup, setDisplayedAudioExercisePopup, setAudioExerciseMessageOpen}) {
  
  function handleClose() {
    setAudioExerciseMessageOpen(false);
    setDisplayedAudioExercisePopup(true);
    LocalStorage.setDisplayedAudioExercisePopup(true);
  }

  if (/*Feature.audio_exercises() && !displayedAudioExercisePopup*/ 1==1) {
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
          <h1>{strings.audioExerciseMessageHeadline}</h1>
          <p>
            {strings.audioExerciseMessageText1}
            <br /> <br />
            {strings.audioExerciseMessageText2} <br /> <br />
            {strings.audioExerciseMessageText3} <br /> 
          </p>
          <t.OrangeButtonMessage>
          {strings.audioExerciseMessageOption5}
          </t.OrangeButtonMessage>
          <t.OrangeButtonMessage>
          {strings.audioExerciseMessageOption3}
          </t.OrangeButtonMessage>
          <t.OrangeButtonMessage>
          {strings.audioExerciseMessageOption1}
          </t.OrangeButtonMessage>
          <t.OrangeButtonMessage>
          {strings.audioExerciseMessageOptionNo}
          </t.OrangeButtonMessage>
          <p>
            {strings.audioExerciseMessageText4}
          </p>
        </s.MyBox>
      </Modal>
    );
  } else return null;
}
