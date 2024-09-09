import React from "react";
import Modal from "../../components/modal_shared/Modal";
import Header from "../../components/modal_shared/Header";
import Heading from "../../components/modal_shared/Heading";
import Main from "../../components/modal_shared/Main";
import Footer from "../../components/modal_shared/Footer";
import ButtonContainer from "../../components/modal_shared/ButtonContainer";
import GoToButton from "../../components/modal_shared/GoToButton";

export default function MyClassroomsModal({
  open,
  onClose,
  classroom,
  leaveClass,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Header>
        <Heading>
          You are about to leave the following classroom: {classroom.name}
        </Heading>
      </Header>
      <Footer>
        <ButtonContainer buttonCountNum={1}>
          <GoToButton
            onClick={(e) => {
              leaveClass(e, classroom);
              onClose();
            }}
          >
            Leave the classroom
          </GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
