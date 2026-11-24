import { useEffect, useState } from "react";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import ModalTitle from "../components/modal_shared/ModalTitle.sc";
import Main from "../components/modal_shared/Main.sc";
import Footer from "../components/modal_shared/Footer.sc";
import ButtonContainer from "../components/modal_shared/ButtonContainer.sc";
import Button from "../pages/_pages_shared/Button.sc";
import TimeInput from "./TimeInput.sc";

// Offers the daily study reminder right after the goal is reached (see
// reminderOffer.js). The time starts at the learner's setting and can be
// changed here; "Remind me" reports the chosen one. The phone's own permission
// prompt only follows "Remind me".
export default function ReminderOfferModal({ open, streak, time, onAccept, onDecline }) {
  const [chosenTime, setChosenTime] = useState(time);
  useEffect(() => {
    if (open) setChosenTime(time);
  }, [open, time]);

  const title = streak === 1 ? "🔥 Day 1 of your streak" : `🔥 ${streak} day streak`;
  return (
    <Modal open={open} onClose={onDecline}>
      <Header>
        <ModalTitle>{title}</ModalTitle>
      </Header>
      <Main>
        <p>
          Want a reminder at{" "}
          <TimeInput
            type="time"
            aria-label="Reminder time"
            value={chosenTime}
            onChange={(e) => e.target.value && setChosenTime(e.target.value)}
          />{" "}
          on days you haven't reached your goal yet?
        </p>
        <p>You can change it later in Settings → Notifications.</p>
      </Main>
      <Footer>
        <ButtonContainer $buttonCountNum={2}>
          <Button className="small" onClick={() => onAccept(chosenTime)}>
            Remind me
          </Button>
          <Button className="small grey" onClick={onDecline}>
            Not now
          </Button>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
