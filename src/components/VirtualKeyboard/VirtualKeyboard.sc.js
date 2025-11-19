import styled from "styled-components";
import { zeeguuOrange, zeeguuDarkOrange, almostBlack } from "../colors";

export const KeyboardContainer = styled.div`
  background: white;
  border: 2px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 6px;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
`;

export const KeyboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #eee;
`;

export const KeyboardTitle = styled.h3`
  margin: 0;
  font-size: 0.8em;
  color: ${almostBlack};
  font-weight: 600;
`;

export const CollapseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0.2em 0.5em;
  color: #666;

  &:hover {
    color: ${zeeguuOrange};
  }
`;

export const CollapsedKeyboard = styled.div`
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 0.8em 1.5em;
  margin-top: 1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
  transition: all 0.2s;

  &:hover {
    border-color: ${zeeguuOrange};
    background: #f9f9f9;
  }

  span {
    color: ${almostBlack};
    font-weight: 500;
  }
`;

export const KeyboardIcon = styled.span`
  font-size: 1.5em;
`;

export const KeyboardRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const KeyRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 1.5px;
  }
`;

export const AccentRow = styled(KeyRow)`
  margin-bottom: 0.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #eee;
`;

export const Key = styled.button`
  /* 9 keys per row, with gaps: calc((100% - 8 * 2px) / 9) */
  width: calc((100% - 8 * 2px) / 9);
  height: 42px;
  padding: 4px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.1s ease, box-shadow 0.1s ease;
  font-family: Arial, sans-serif;
  flex-shrink: 0;
  box-sizing: border-box;

  &:hover {
    background: ${zeeguuOrange};
    border-color: ${zeeguuDarkOrange};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: ${zeeguuOrange};
    border-color: ${zeeguuDarkOrange};
    color: white;
    transform: translateY(0);
    box-shadow: none;
    transition: none;
  }

  @media (max-width: 768px) {
    width: calc((100% - 8 * 1.5px) / 9);
    height: 38px;
    padding: 2px;
    font-size: 18px;
  }
`;

export const SpecialKey = styled(Key)`
  width: auto;
  min-width: calc((100% - 8 * 2px) / 9 * 2.5);
  font-size: 16px;
  background: ${props => props.isActive ? zeeguuOrange : '#f5f5f5'};
  color: ${props => props.isActive ? 'white' : almostBlack};
  border-color: ${props => props.isActive ? zeeguuDarkOrange : '#bbb'};

  &:hover {
    background: ${zeeguuOrange};
    color: white;
  }

  @media (max-width: 768px) {
    min-width: calc((100% - 8 * 1.5px) / 9 * 2.5);
    font-size: 13px;
  }
`;

export const SpaceKey = styled(Key)`
  width: auto;
  flex: 1;
  font-size: 14px;
  background: #f5f5f5;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;
