import React from "react";
import Modal from "../../../components/modal_shared/Modal";
import Header from "../../../components/modal_shared/Header";
import Heading from "../../../components/modal_shared/Heading";
import { Footer } from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer";
import { GoToButton } from "../../../components/modal_shared/GoToButton.sc";

import * as s from "./LeaveClassroomModal.sc";

export default function LeaveClassroomModal({
  isLeaveClassroomModalOpen,
  handleCloseLeaveClassroomModal,
  currentClassroom,
  leaveClassroom,
}) {
  function handleLeaveClassroom(e) {
    leaveClassroom(e, currentClassroom);
    handleCloseLeaveClassroomModal();
  }
  return (
    <Modal
      open={isLeaveClassroomModalOpen}
      onClose={handleCloseLeaveClassroomModal}
    >
      <Header>
        <Heading>
          You are about to leave the following classroom:{" "}
          <s.ColorAccent>{currentClassroom.name}</s.ColorAccent>
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
