import styled from "styled-components";

export const SessionCard = styled.div`
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1em;
  margin: 0.5em 0;
  box-shadow: 0 1px 3px var(--shadow-color);
`;

export const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
`;

export const SessionTime = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

export const SessionDuration = styled.span`
  font-size: 0.9em;
  color: var(--text-secondary);
`;

export const SessionType = styled.span`
  display: inline-block;
  padding: 0.2em 0.6em;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 500;
  margin-left: 0.5em;

  &.reading {
    background: #e3f2fd;
    color: #1565c0;
  }

  &.exercise {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.browsing {
    background: #fff3e0;
    color: #ef6c00;
  }

  &.audio {
    background: #f3e5f5;
    color: #7b1fa2;
  }
`;

export const ArticleTitle = styled.div`
  font-size: 1.1em;
  margin-bottom: 0.5em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--text-primary);

  a {
    color: var(--link-color);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .source-badge {
    font-size: 0.65em;
    padding: 0.15em 0.4em;
    border-radius: 3px;
    font-weight: 500;
    text-transform: uppercase;

    &.extension {
      background: #e8f5e9;
      color: #2e7d32;
    }

    &.web {
      background: #e3f2fd;
      color: #1565c0;
    }
  }
`;

export const WordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em;
  margin-top: 0.75em;
  padding-top: 0.5em;
  border-top: 1px solid var(--border-light);
`;

export const WordChip = styled.span`
  background: var(--card-bg);
  padding: 0.5em 0.8em;
  border-radius: 6px;
  font-size: 1em;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px var(--shadow-color);

  .origin {
    font-weight: 600;
    color: #1565c0;

    &.clickable:hover {
      text-decoration: underline;
    }
  }

  .separator {
    color: var(--text-faint);
    margin: 0 0.4em;
  }

  .translation {
    color: var(--text-primary);
    font-weight: 600;

    &.clickable:hover {
      text-decoration: underline;
    }
  }

  .result {
    margin-left: 0.3em;
  }

  &.reading {
    background: #e3f2fd;
    border-color: #90caf9;
  }

  &.browsing {
    background: #fff8e1;
    border-color: #ffe082;
    .origin {
      color: #ef6c00;
    }
  }

  &.audio {
    background: #f3e5f5;
    border-color: #ce93d8;
    .origin {
      color: #7b1fa2;
    }
  }

  &.correct {
    background: #e8f5e9;
    border-color: #a5d6a7;
    .origin {
      color: #2e7d32;
    }
  }

  &.incorrect {
    background: #ffebee;
    border-color: #ef9a9a;
    .origin {
      color: #c62828;
    }
  }

  &.more {
    background: #f0f0f0;
    font-style: italic;
  }
`;

export const ExerciseStats = styled.div`
  font-size: 0.9em;
  color: var(--text-secondary);
  margin-bottom: 0.5em;
`;

export const FocusBadge = styled.span`
  display: inline-block;
  padding: 0.15em 0.5em;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 500;
  margin-left: 0.5em;

  &.focused {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.moderate {
    background: #fff3e0;
    color: #ef6c00;
  }

  &.distracted {
    background: #ffebee;
    color: #c62828;
  }
`;

export const InfoNote = styled.div`
  font-size: 0.85em;
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
  padding: 0.5em;
  margin: 0.5em 0;
`;

export const DateHeader = styled.div`
  font-size: 0.9em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 0.3em;
`;

export const SummaryCard = styled.div`
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.2em;
  margin-bottom: 1.5em;
  box-shadow: 0 1px 3px var(--shadow-color);
`;

export const SummaryTitle = styled.div`
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 1em;
  color: var(--text-primary);
`;

export const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.2em;
  flex-wrap: wrap;
  gap: 0.5em;
`;

export const StatItem = styled.div`
  text-align: center;
  padding: 0.5em 1em;

  .label {
    font-size: 0.85em;
    font-weight: 600;
    color: ${(props) => props.color || "var(--text-primary)"};
    margin-bottom: 0.2em;
  }

  .time {
    font-size: 1.4em;
    font-weight: 700;
    color: ${(props) => props.color || "var(--text-primary)"};
  }

  .words {
    font-size: 0.9em;
    font-weight: 600;
    color: ${(props) => props.color || "var(--text-primary)"};
    opacity: 0.7;
    margin-top: 0.1em;
  }
`;

export const BarChartContainer = styled.div`
  margin-top: 0.5em;
`;

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.6em;

  .label {
    width: 80px;
    font-size: 0.85em;
    color: var(--text-secondary);
  }

  .bar-wrapper {
    flex: 1;
    height: 20px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .bar.reading {
    background: #64b5f6;
  }

  .bar.exercise {
    background: #81c784;
  }

  .bar.browsing {
    background: #ffb74d;
  }

  .bar.audio {
    background: #ba68c8;
  }

  .time {
    width: 70px;
    text-align: right;
    font-size: 0.85em;
    color: var(--text-secondary);
    margin-left: 0.5em;
  }
`;

export const TimeSelector = styled.div`
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;

  select {
    padding: 0.4em 0.8em;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 0.95em;
  }

  .custom-dates {
    display: flex;
    align-items: center;
    gap: 0.5em;

    input[type="date"] {
      padding: 0.4em;
      border-radius: 4px;
      border: 1px solid #ddd;
      font-size: 0.9em;
    }

    span {
      color: #666;
    }

    button {
      padding: 0.4em 0.8em;
      border-radius: 4px;
      border: 1px solid #1565c0;
      background: #1565c0;
      color: white;
      font-size: 0.9em;
      cursor: pointer;

      &:hover {
        background: #1256a0;
      }
    }
  }
`;

export const ClickableOrigin = styled.span`
  font-weight: 600;
  color: #1565c0;
  cursor: pointer;
  text-decoration: ${(props) => (props.isSpeaking ? "underline" : "none")};

  &:hover {
    text-decoration: underline;
  }
`;

export const ClickableTranslation = styled.span`
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const OverlayLoader = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;
