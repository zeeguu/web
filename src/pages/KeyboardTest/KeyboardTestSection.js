import React from "react";
import VirtualKeyboard from "../../components/VirtualKeyboard/VirtualKeyboard";
import { Section, SectionTitle, Label, TestInput, InputValue, Info } from "./KeyboardTest.sc";

export default function KeyboardTestSection({
  title,
  value,
  onChange,
  placeholder,
  languageCode,
  infoText,
  inputMode = "none",
  initialCollapsed = false,
}) {
  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      <Label>Test Input:</Label>
      <TestInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
      />
      <VirtualKeyboard
        languageCode={languageCode}
        onInput={onChange}
        currentValue={value}
        initialCollapsed={initialCollapsed}
      />
      <Label>Current Value:</Label>
      <InputValue>{value || "(empty)"}</InputValue>
      <Info>{infoText}</Info>
    </Section>
  );
}
