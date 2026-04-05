import React, { useRef } from "react";
import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.textarea`
  width: 100%;
  padding: 12px 32px 12px 12px;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  text-align: center;
  resize: none;
  field-sizing: content;
`;

const ClearBtn = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 18px;
  display: flex;
`;

export default function ClearableInput({ value, onChange, onClear, placeholder, maxLength, tabIndex, rows = 1, ...props }) {
  const inputRef = useRef(null);

  return (
    <Wrapper>
      <StyledInput
        ref={inputRef}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        tabIndex={tabIndex}
        onChange={onChange}
        {...props}
      />
      {value && (
        <ClearBtn
          onClick={() => {
            onClear?.();
            inputRef.current?.focus();
          }}
        >
          <CancelIcon fontSize="inherit" />
        </ClearBtn>
      )}
    </Wrapper>
  );
}
