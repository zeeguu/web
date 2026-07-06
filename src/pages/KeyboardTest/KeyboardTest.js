import React, { useState } from 'react';
import VirtualKeyboard from '../../components/VirtualKeyboard/VirtualKeyboard';
import {
  Container,
  Title,
  Section,
  SectionTitle,
  TestInput,
  InputValue,
  Label,
  LanguageSelector,
  Info,
} from './styles';

export default function KeyboardTest() {
  const [danishInput, setDanishInput] = useState('');
  const [greekInput, setGreekInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('da');
  const [customInput, setCustomInput] = useState('');

  return (
    <Container>
      <Title>Virtual Keyboard Test Page</Title>

      <Section>
        <SectionTitle>Danish Keyboard (da)</SectionTitle>
        <Label>Test Input:</Label>
        <TestInput
          type="text"
          value={danishInput}
          onChange={(e) => setDanishInput(e.target.value)}
          placeholder="Type or use the virtual keyboard below..."
          inputMode="none"
        />
        <VirtualKeyboard
          languageCode="da"
          onInput={setDanishInput}
          currentValue={danishInput}
          initialCollapsed={false}
        />
        <Label>Current Value:</Label>
        <InputValue>{danishInput || '(empty)'}</InputValue>
        <Info>Danish keyboard includes special characters: æ, ø, å</Info>
      </Section>

      <Section>
        <SectionTitle>Greek Keyboard (el)</SectionTitle>
        <Label>Test Input:</Label>
        <TestInput
          type="text"
          value={greekInput}
          onChange={(e) => setGreekInput(e.target.value)}
          placeholder="Πληκτρολογήστε ή χρησιμοποιήστε το εικονικό πληκτρολόγιο..."
          inputMode="none"
        />
        <VirtualKeyboard
          languageCode="el"
          onInput={setGreekInput}
          currentValue={greekInput}
          initialCollapsed={false}
        />
        <Label>Current Value:</Label>
        <InputValue>{greekInput || '(empty)'}</InputValue>
        <Info>Greek keyboard includes all Greek letters and accented characters</Info>
      </Section>

      <Section>
        <SectionTitle>Dynamic Language Selector</SectionTitle>
        <Label>Select Language:</Label>
        <LanguageSelector
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="da">Danish</option>
          <option value="el">Greek</option>
          <option value="en">English (no keyboard)</option>
          <option value="de">German (no keyboard)</option>
        </LanguageSelector>
        <Label>Test Input:</Label>
        <TestInput
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Type or use the virtual keyboard..."
          inputMode={['da', 'el'].includes(selectedLanguage) ? 'none' : 'text'}
        />
        <VirtualKeyboard
          languageCode={selectedLanguage}
          onInput={setCustomInput}
          currentValue={customInput}
          initialCollapsed={false}
        />
        <Label>Current Value:</Label>
        <InputValue>{customInput || '(empty)'}</InputValue>
        <Info>
          {['da', 'el'].includes(selectedLanguage)
            ? 'Virtual keyboard is available for this language'
            : 'No virtual keyboard available for this language'}
        </Info>
      </Section>

      <Section>
        <SectionTitle>Test Features</SectionTitle>
        <ul>
          <li>✓ Click keys to type characters</li>
          <li>✓ Use Shift to toggle uppercase/lowercase</li>
          <li>✓ Use Backspace to delete characters</li>
          <li>✓ Use Space to add spaces</li>
          <li>✓ Click the collapse button (▼) to minimize the keyboard</li>
          <li>✓ When collapsed, you can click the input to use your OS keyboard</li>
          <li>✓ Keyboard state is saved in localStorage</li>
          <li>✓ Test on mobile devices to see touch behavior</li>
        </ul>
      </Section>
    </Container>
  );
}
