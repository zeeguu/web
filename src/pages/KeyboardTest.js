import React, { useState } from 'react';
import VirtualKeyboard from '../components/VirtualKeyboard/VirtualKeyboard';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2em auto;
  padding: 2em;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1em;
`;

const Section = styled.div`
  margin-bottom: 3em;
  padding: 2em;
  background: #f9f9f9;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  color: #555;
  margin-bottom: 1em;
`;

const TestInput = styled.input`
  width: 100%;
  padding: 1em;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1em;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ff8800;
  }
`;

const InputValue = styled.div`
  margin-top: 1em;
  padding: 1em;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 60px;
  word-break: break-all;
`;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 0.5em;
  color: #666;
`;

const LanguageSelector = styled.select`
  padding: 0.5em 1em;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1em;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ff8800;
  }
`;

const Info = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 1em;
`;

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
        <Info>
          Danish keyboard includes special characters: æ, ø, å
        </Info>
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
        <Info>
          Greek keyboard includes all Greek letters and accented characters
        </Info>
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
