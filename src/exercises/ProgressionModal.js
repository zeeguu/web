import { useState, useEffect } from "react";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header";
import Heading from "../components/modal_shared/Heading";
import Main from "../components/modal_shared/Main";
import Footer from "../components/modal_shared/Footer";
import Checkbox from "../components/modal_shared/Checkbox";
import strings from "../i18n/definitions";
import GoToButton from "../components/modal_shared/GoToButton";
import ButtonContainer from "../components/modal_shared/ButtonContainer";
import LocalStorage from "../assorted/LocalStorage";

export default function ProgressionModal({ open, onClose, api }) {
  const [productiveExercisesChecked, setProductiveExercisesChecked] = useState(
    LocalStorage.getProductiveExercisesEnabled(),
  );
  const [dontShowMsg, setDontShowMsg] = useState(false);

  const toggleProductiveExercises = () => {
    setProductiveExercisesChecked(!productiveExercisesChecked);
  };

  const toggleDontShowMsg = () => {
    setDontShowMsg(!dontShowMsg);
  };

  const handleClose = () => {
    api.saveUserPreferences({
      productive_exercises: productiveExercisesChecked.toString(),
    });

    localStorage.setItem(
      "productiveExercisesEnabled",
      JSON.stringify(productiveExercisesChecked),
    );

    if (dontShowMsg) {
      localStorage.setItem("hideProgressionModal", "true");
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Header>
        <Heading>{strings.learningCycleCongrats}</Heading>
      </Header>
      <Main>
        <p>{strings.learningCycleExplanation}</p>
      </Main>
      <Footer>
        <Checkbox
          label={strings.optOutProductiveKnowledge}
          checked={productiveExercisesChecked}
          onChange={toggleProductiveExercises}
        />

        <ButtonContainer>
          <GoToButton onClick={handleClose}>Back to the Exercises</GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
