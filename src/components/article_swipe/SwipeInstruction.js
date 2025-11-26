import React, { useEffect, useState } from "react";
import * as s from "./SwipeInstruction.sc";
import SwipeIcon from "@mui/icons-material/Swipe";

export default function SwipeInstruction({ onClose }) {

  const handleClose = () => {
    onClose?.();
  };

  return (
    <s.InstructionContainer>
      <s.InstructionBox>
        <s.IconWrapper>
            <SwipeIcon style={{ fontSize: "6em" }} />
        </s.IconWrapper>
        <s.InstructionText>Swipe right to save, left to dismiss, or tap the buttons below.</s.InstructionText>
        <s.ConfirmButton onClick={handleClose}>Got it!</s.ConfirmButton>
      </s.InstructionBox>
    </s.InstructionContainer>
  );
}
