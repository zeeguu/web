import React from "react";
import { TextSizeRow, TextSizeControls, FontSizeButton, FontSizeValue } from "./TextSizeControl.sc";

export default function TextSizeControl({ value, onDecrease, onIncrease }) {
  return (
    <TextSizeRow>
      <span>Text size</span>
      <TextSizeControls>
        <FontSizeButton type="button" onClick={onDecrease} aria-label="Decrease text size">
          A−
        </FontSizeButton>
        <FontSizeValue>{value}</FontSizeValue>
        <FontSizeButton type="button" onClick={onIncrease} aria-label="Increase text size">
          A+
        </FontSizeButton>
      </TextSizeControls>
    </TextSizeRow>
  );
}
