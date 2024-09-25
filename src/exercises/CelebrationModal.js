import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Modal from "../components/modal_shared/Modal";
import { Header } from "../components/modal_shared/Header.sc";
import { Heading } from "../components/modal_shared/Heading.sc";
import { Main } from "../components/modal_shared/Main.sc";
import { Footer } from "../components/modal_shared/Footer.sc";
import strings from "../i18n/definitions";
import { GoToButton } from "../components/modal_shared/GoToButton.sc";
import ButtonContainer from "../components/modal_shared/ButtonContainer";

export default function CelebrationModal({ open, onClose }) {
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
            recycle={true}
            style={{ position: "fixed" }}
          />
        </div>
      )}
      <Modal open={open} onClose={onClose}>
        <Header>
          <Heading>{strings.celebrationTitle}</Heading>
        </Header>
        <Main>
          <p>{strings.celebrationMsg}</p>
        </Main>
        <Footer>
          <ButtonContainer>
            <GoToButton onClick={onClose}>
              Continue with the exercises
            </GoToButton>
          </ButtonContainer>
        </Footer>
      </Modal>
    </>
  );
}
