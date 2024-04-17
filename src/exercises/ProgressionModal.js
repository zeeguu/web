import { useState, useEffect } from "react";
import Modal from "../components/redirect_notification/modal_shared/Modal";
import Header from "../components/redirect_notification/modal_shared/Header";
import Body from "../components/redirect_notification/modal_shared/Body";
import Footer from "../components/redirect_notification/modal_shared/Footer";
import Checkbox from "../components/redirect_notification/modal_shared/Checkbox";
import strings from "../i18n/definitions";
import * as s from "../components/redirect_notification/RedirectionNotificationModal.sc";

export default function ProgressionModal({open, onClose, api}) {

  const [disableProductiveExercises, setDisableProductiveExercises] = useState();
  const [dontShowMsg, setDontShowMsg] = useState(false);

  useEffect(() => {
    api.getUserPreferences((preferences) => {
      setDisableProductiveExercises(
        preferences["productive_exercises"] === undefined ||
          preferences["productive_exercises"] === "false",
      );
    });
  }, [api]);

  const toggleProductiveExercises = () => {
    setDisableProductiveExercises(!disableProductiveExercises);
  };

  const toggleDontShowMsg = () => {
    setDontShowMsg(!dontShowMsg);
  };

  const handleClose = () => {
    api.saveUserPreferences({ productive_exercises: (!disableProductiveExercises).toString()});

    localStorage.setItem("productiveExercisesEnabled", JSON.stringify(!disableProductiveExercises));

    if (dontShowMsg){
        localStorage.setItem("hideProgressionModal", "true");
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Header>{strings.learningCycleCongrats}</Header>
      <Body>
        <p>{strings.learningCycleExplanation}</p>
      </Body>
      <Footer>
        <Checkbox
            label={strings.optOutProductiveKnowledge}
            checked={disableProductiveExercises}
            onChange={toggleProductiveExercises}
        />
        <Checkbox
            label={strings.dontShowMsg}
            checked={dontShowMsg}
            onChange={toggleDontShowMsg}
        />
        <s.ButtonsContainer>
            <s.GoToButton
                onClick={handleClose}
            >
                Back to the Exercises
            </s.GoToButton>
        </s.ButtonsContainer>
      </Footer>
    </Modal>
  );
}
