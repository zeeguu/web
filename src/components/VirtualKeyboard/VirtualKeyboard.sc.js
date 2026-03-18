import styled from "styled-components";
import { zeeguuOrange, zeeguuDarkOrange } from "../colors";

export const KeyboardContainer = styled.div`
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  padding: 8px;
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px var(--shadow-color);
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 6px 0;
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

export const KeyboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid var(--border-light);

  @media (max-width: 768px) {
    padding-left: 6px;
    padding-right: 6px;
  }
`;

export const KeyboardTitle = styled.h3`
  margin: 0;
  font-size: 0.8em;
  color: var(--text-primary);
  font-weight: 600;
`;

export const CollapseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0.2em 0.5em;
  color: var(--text-muted);

  &:hover {
    color: ${zeeguuOrange};
  }
`;

export const CollapsedKeyboard = styled.div`
  background: var(--card-bg);
  border: 2px solid var(--border-color);
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
    background: var(--hover-bg);
  }

  span {
    color: var(--text-primary);
    font-weight: 500;
  }
`;

export const KeyboardIcon = styled.span`
  font-size: 1.5em;
`;

export const CollapsedKeyboardWithKeys = styled.div`
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 8px;
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 6px;
  }
`;

export const SpecialKeysRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const ExpandButton = styled.button`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      background: ${zeeguuOrange};
      border-color: ${zeeguuDarkOrange};
      color: white;
    }
  }

  &:active {
    background: ${zeeguuOrange};
    border-color: ${zeeguuDarkOrange};
    color: white;
  }
`;

export const KeyboardRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  @media (max-width: 768px) {
    padding-left: 6px;
    padding-right: 6px;
  }
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
  border-bottom: 1px solid var(--border-light);
`;

export const Key = styled.button`
  /* 9 keys per row, with gaps: calc((100% - 8 * 2px) / 9) */
  width: calc((100% - 8 * 2px) / 9);
  height: 42px;
  padding: 4px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  flex-shrink: 0;
  box-sizing: border-box;
  color: var(--text-primary);
  -webkit-tap-highlight-color: transparent;

  /* Only apply hover on devices that support it (not touch) */
  @media (hover: hover) {
    transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.1s ease, box-shadow 0.1s ease;

    &:hover {
      background: ${zeeguuOrange};
      border-color: ${zeeguuDarkOrange};
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px var(--shadow-color);
    }
  }

  &:active {
    background: ${zeeguuOrange};
    border-color: ${zeeguuDarkOrange};
    color: white;
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
  background: ${props => props.isActive ? zeeguuOrange : 'var(--bg-secondary)'};
  color: ${props => props.isActive ? 'white' : 'var(--text-primary)'};
  border-color: ${props => props.isActive ? zeeguuDarkOrange : 'var(--border-color)'};

  @media (hover: hover) {
    &:hover {
      background: ${zeeguuOrange};
      color: white;
    }
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
  background: var(--bg-secondary);

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;
