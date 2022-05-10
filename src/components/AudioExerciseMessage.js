import Modal from "@mui/material/Modal";
import * as s from "./ExtensionMessage.sc";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import strings from "../i18n/definitions";
import React, { useEffect, useState } from "react";
import * as t from "../exercises/exerciseTypes/Exercise.sc";


export default function AudioExerciseMessage({
  displayedAudioExperimentPopup,
  setDisplayedAudioExperimentPopup,
}) {

  const [open, setAudioExerciseMessageOpen] = useState(false);

  useEffect(() => {
    if (!LocalStorage.displayedAudioExperimentPopup()) {
      setAudioExerciseMessageOpen(true);
    }
  }, [])

  function handleClose() {
    setAudioExerciseMessageOpen(false);
    setDisplayedAudioExperimentPopup(true);
    LocalStorage.setDisplayedAudioExperimentPopup(true);
  }

  function handleSelection(sessions) {
    setAudioExerciseMessageOpen(false);
    
    console.log("popup displayed " + LocalStorage.displayedAudioExperimentPopup());
    LocalStorage.setDisplayedAudioExperimentPopup(true);
    console.log("popup displayed " + LocalStorage.displayedAudioExperimentPopup());

    LocalStorage.setTargetNoOfAudioSessions(sessions);
    console.log("Target no of sessions chosen: " + LocalStorage.getTargetNoOfAudioSessions());
    
    LocalStorage.setAudioExperimentNoOfSessions(0);
    console.log("No of sessions completed: " + LocalStorage.getAudioExperimentNoOfSessions());

    LocalStorage.checkAndUpdateAudioExperimentCompleted(false);
    console.log("Experiment completed: " + LocalStorage.audioExperimentCompleted());
  }
  
  if (Feature.audio_exercises() && !LocalStorage.displayedAudioExperimentPopup()) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        displayedAudioExperimentPopup={displayedAudioExperimentPopup}
        setDisplayedAudioExperimentPopup={setDisplayedAudioExperimentPopup}
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
          <t.OrangeButtonMessage role="button"onClick={() => handleSelection("5")}>
            {strings.audioExerciseMessageOption5}
          </t.OrangeButtonMessage>

          <t.OrangeButtonMessage role="button" onClick={() => handleSelection("3")}>
            {strings.audioExerciseMessageOption3}
          </t.OrangeButtonMessage>

          <t.OrangeButtonMessage role="button" onClick={() => handleSelection("1")}>
            {strings.audioExerciseMessageOption1}
          </t.OrangeButtonMessage>

          <t.OrangeButtonMessage role="button" onClick={() => handleClose}>
            {strings.audioExerciseMessageOptionNo}
          </t.OrangeButtonMessage>
          <p>{strings.audioExerciseMessageText4}</p>
        </s.MyBox>
      </Modal>
    );
  } else return null;
}
