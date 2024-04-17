import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Modal from "../components/redirect_notification/modal_shared/Modal";
import Header from "../components/redirect_notification/modal_shared/Header";
import Body from "../components/redirect_notification/modal_shared/Body";
import Footer from "../components/redirect_notification/modal_shared/Footer";
import strings from "../i18n/definitions";
import * as s from "../components/redirect_notification/RedirectionNotificationModal.sc";

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
      <Body>
        <p>{strings.celebrationMsg}</p>
      </Body>
        <Footer>
        <s.ButtonsContainer>
            <s.GoToButton
                onClick={onClose}
            >
                Back to the Exercises
            </s.GoToButton>
        </s.ButtonsContainer>
      </Footer>
    </Modal>
    </>
  );
}
