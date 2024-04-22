import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header";
import Main from "../components/modal_shared/Main";
import Footer from "../components/modal_shared/Footer";
import strings from "../i18n/definitions";
import GoToButton from "../components/modal_shared/GoToButton";
import ButtonContainer from "../components/modal_shared/ButtonContainer";

export default function ProgressionModal({open, onClose}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [open]);

  return (
    <>
    {showConfetti && (
      <div>
        <Confetti 
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}/>
      </div>
    )}
    <Modal open={open} onClose={onClose}>
      <Header>{strings.celebrationTitle}</Header>
      <Main>
        <p>{strings.celebrationMsg}</p>
      </Main>
        <Footer>
        <ButtonContainer>
            <GoToButton
                onClick={onClose}
            >
                Back to the Exercises
            </GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
    </>
  );
}
