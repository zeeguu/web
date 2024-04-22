import { useState, useEffect } from "react";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header";
import Main from "../components/modal_shared/Main";
import Footer from "../components/modal_shared/Footer";
import Checkbox from "../components/modal_shared/Checkbox";
import strings from "../i18n/definitions";
import GoToButton from "../components/modal_shared/GoToButton";
import ButtonContainer from "../components/modal_shared/ButtonContainer";

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
      <Main>
        <p>{strings.learningCycleExplanation}</p>
      </Main>
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
        <ButtonContainer>
            <GoToButton
                onClick={handleClose}
            >
                Back to the Exercises
            </GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
