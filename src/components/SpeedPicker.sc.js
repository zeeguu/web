import styled from "styled-components";
import Tag from "../pages/_pages_shared/Tag.sc";

export const SpeedPill = styled.button`
  background: transparent;
  border: 1.5px solid var(--player-icon-color);
  color: var(--player-icon-color);
  /* A stadium rather than a circle: "0.85x" and "1.25x" touched a 38px
     circle's edge. Fixed width, so the row doesn't shift between speeds. */
  border-radius: 19px;
  width: 46px;
  height: 38px;
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  &:disabled {
    border-color: var(--text-muted);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;

export const SpeedPanel = styled.div`
  box-sizing: border-box;
  width: min(340px, calc(100vw - 32px));
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

export const SpeedReadout = styled.div`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
`;

export const SliderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StepButton = styled.button`
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    color: var(--text-muted);
    cursor: default;
  }
`;

export const PresetRow = styled.div`
  width: 100%;
  display: flex;
  gap: 0.4rem;
`;

// Five equal pills across the panel: Tag's own margins and side padding would
// overflow a phone-width panel.
export const PresetPill = styled(Tag)`
  &.small {
    flex: 1;
    margin: 0;
    padding: 0.5rem 0;
  }
`;
