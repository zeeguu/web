import React from "react";
import Modal from "../../../components/modal_shared/Modal";
import { Header } from "../../../components/modal_shared/Header.sc";
import { Heading } from "../../../components/modal_shared/Heading.sc";
import { Footer } from "../../../components/modal_shared/Footer.sc";
import { ButtonContainer } from "../../../components/modal_shared/ButtonContainer.sc";
import { Button } from "../../_pages_shared/Button.sc";

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
          <Button className="small" onClick={handleLeaveClassroom}>
            Leave the classroom
          </Button>
        </ButtonContainer>
      </Footer>
    </Modal>
  );
}
