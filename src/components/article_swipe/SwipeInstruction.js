import React, { useEffect, useState } from "react";
import * as s from "./SwipeInstruction.sc";
import SwipeIcon from "@mui/icons-material/Swipe";
import strings from "../../i18n/definitions";

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
        <s.InstructionText>{strings.swipeInstructionText}</s.InstructionText>
        <s.ConfirmButton onClick={handleClose}>{strings.swipeInstructionConfirm}</s.ConfirmButton>
      </s.InstructionBox>
    </s.InstructionContainer>
  );
}
