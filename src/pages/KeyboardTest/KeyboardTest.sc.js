import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 2em auto;
  padding: 2em;
  font-family: Arial, sans-serif;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    padding: 1em;
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1em;

  @media (max-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }
`;

export const Section = styled.div`
  margin-bottom: 3em;
  padding: 2em;
  background: #f9f9f9;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 1em 0;
    border-radius: 0;
    margin-bottom: 0;
    border-bottom: 1px solid #ddd;
  }
`;

export const SectionTitle = styled.h2`
  color: #555;
  margin-bottom: 1em;

  @media (max-width: 768px) {
    padding-left: 1em;
    padding-right: 1em;
  }
`;

export const TestInput = styled.input`
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

  @media (max-width: 768px) {
    margin-left: 1em;
    margin-right: 1em;
    width: calc(100% - 2em);
    border-radius: 0;
  }
`;

export const InputValue = styled.div`
  margin-top: 1em;
  padding: 1em;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 60px;
  word-break: break-all;

  @media (max-width: 768px) {
    margin-left: 1em;
    margin-right: 1em;
    border-radius: 0;
  }
`;

export const Label = styled.div`
  font-weight: bold;
  margin-bottom: 0.5em;
  color: #666;

  @media (max-width: 768px) {
    padding-left: 1em;
    padding-right: 1em;
  }
`;

export const LanguageSelector = styled.select`
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

  @media (max-width: 768px) {
    margin-left: 1em;
    margin-right: 1em;
    width: calc(100% - 2em);
    border-radius: 0;
  }
`;

export const Info = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 1em;

  @media (max-width: 768px) {
    padding-left: 1em;
    padding-right: 1em;
  }
`;
