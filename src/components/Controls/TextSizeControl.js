import React from "react";
import {
  textSizeRow,
  textSizeControls,
  fontSizeButtonStyle,
  fontSizeValue,
} from "./TextSizeControl.sc";

export default function TextSizeControl({ value, onDecrease, onIncrease }) {
  return (
    <div style={textSizeRow}>
      <span>Text size</span>
      <span style={textSizeControls}>
        <button
          type="button"
          onClick={onDecrease}
          aria-label="Decrease text size"
          style={fontSizeButtonStyle}
        >
          A−
        </button>
        <span style={fontSizeValue}>{value}</span>
        <button
          type="button"
          onClick={onIncrease}
          aria-label="Increase text size"
          style={fontSizeButtonStyle}
        >
          A+
        </button>
      </span>
    </div>
  );
}
