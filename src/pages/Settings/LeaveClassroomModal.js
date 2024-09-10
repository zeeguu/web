import React from "react";
import Modal from "../../components/modal_shared/Modal";
import Header from "../../components/modal_shared/Header";
import Heading from "../../components/modal_shared/Heading";
import Footer from "../../components/modal_shared/Footer";
import ButtonContainer from "../../components/modal_shared/ButtonContainer";
import GoToButton from "../../components/modal_shared/GoToButton";

export default function LeaveClassroomModal({
  isLeaveClassroomModalOpen,
  handleCloseLeaveClassroomModal,
  classroom,
  leaveClass,
}) {
  function handleLeaveClassroom(e) {
    leaveClass(e, classroom);
    handleCloseLeaveClassroomModal();
  }
  return (
    <Modal
      open={isLeaveClassroomModalOpen}
      onClose={handleCloseLeaveClassroomModal}
    >
      <Header>
        <Heading>
          You are about to leave the following classroom: {classroom.name}
        </Heading>
      </Header>
      <Footer>
        <ButtonContainer buttonCountNum={1}>
          <GoToButton onClick={handleLeaveClassroom}>
            Leave the classroom
          </GoToButton>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
