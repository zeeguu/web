import styled from "styled-components";
import { zeeguuWarmYellow, zeeguuDarkOrange, zeeguuRed } from "../../components/colors";

export const FlashcardsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  @media screen and (max-width: 768px) {
    padding: 10px;
  }
`;

export const HeaderSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
`;

export const TitleSection = styled.div`
  margin-bottom: 15px;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  h2 {
    margin: 0;
    color: ${zeeguuDarkOrange};
  }
`;

export const FiltersContainer = styled.div`
  margin-bottom: 15px;
  max-width: 260px;
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    gap: 15px;
  }
`;

export const StatItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const StatLabel = styled.span`
  font-weight: bold;
  color: #666;
`;

export const StatValue = styled.span`
  color: ${(props) => (props.$isStreak ? zeeguuRed : "#333")};
  font-weight: ${(props) => (props.$isStreak ? "bold" : "normal")};
  animation: ${(props) => (props.$isStreak ? "pulse 0.5s ease" : "none")};

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

export const Flashcard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const CardContent = styled.div`
  padding: 30px;

  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
`;

export const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid ${zeeguuDarkOrange};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const NoCardsMessage = styled.div`
  text-align: center;
  padding: 40px;

  p {
    margin-bottom: 15px;
    font-size: 18px;
    color: #666;
  }
`;

export const PromptSection = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

export const PromptLabel = styled.h3`
  color: #666;
  font-size: 14px;
  margin: 10px 0 5px;
`;

export const PromptText = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 15px 0;

  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

export const RecordingSection = styled.div`
  text-align: center;
  margin: 25px 0;
`;

export const StatusMessage = styled.div`
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  background: ${(props) => {
    if (props.$statusType === "recording") return "#ffebee";
    if (props.$statusType === "processing") return "#fff3e0";
    if (props.$statusType === "error") return "#ffebee";
    if (props.$statusType === "cooldown") return "#e3f2fd";
    return "#f5f5f5";
  }};
  color: ${(props) => {
    if (props.$statusType === "recording") return "#f44336";
    if (props.$statusType === "processing") return "#ff9800";
    if (props.$statusType === "error") return "#f44336";
    if (props.$statusType === "cooldown") return "#2196f3";
    return "#333";
  }};
  animation: ${(props) => (props.$statusType === "recording" ? "pulse 1s infinite" : "none")};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

export const RecordingVisualization = styled.div`
  margin-top: 15px;
`;

export const SoundWave = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  height: 40px;

  span {
    width: 4px;
    height: 20px;
    background: ${zeeguuRed};
    border-radius: 2px;
    animation: wave 0.5s ease infinite alternate;
  }

  span:nth-child(2) {
    animation-delay: 0.1s;
    height: 30px;
  }
  span:nth-child(3) {
    animation-delay: 0.2s;
    height: 40px;
  }
  span:nth-child(4) {
    animation-delay: 0.3s;
    height: 30px;
  }
  span:nth-child(5) {
    animation-delay: 0.4s;
    height: 20px;
  }

  @keyframes wave {
    from {
      transform: scaleY(0.5);
    }
    to {
      transform: scaleY(1);
    }
  }
`;

export const ResultSection = styled.div`
  margin-top: 25px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  h4 {
    margin: 0 0 10px 0;
    color: #333;
  }
`;

export const UserSpeech = styled.div`
  background: white;
  padding: 12px;
  border-radius: 6px;
  margin: 10px 0;
  font-family: monospace;
  word-break: break-word;
`;

export const FeedbackContainer = styled.div`
  margin: 15px 0;
`;

export const AccuracyMeter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
`;

export const AccuracyLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

export const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${(props) => {
    if (props.$accuracy >= 70) return "#4caf50";
    if (props.$accuracy >= 40) return "#ff9800";
    return "#f44336";
  }};
  transition: width 0.5s ease;
  border-radius: 4px;
`;

export const AccuracyPercentage = styled.span`
  font-weight: bold;
  min-width: 45px;
`;

export const FeedbackMessage = styled.div`
  padding: 12px;
  border-radius: 6px;
  margin: 10px 0;
  background: ${(props) => {
    if (props.$feedbackType === "success") return "#c8e6c9";
    if (props.$feedbackType === "warning") return "#ffe0b2";
    return "#ffcdd2";
  }};
  color: ${(props) => {
    if (props.$feedbackType === "success") return "#2e7d32";
    if (props.$feedbackType === "warning") return "#ef6c00";
    return "#c62828";
  }};
`;

export const WordBreakdown = styled.div`
  margin-top: 20px;

  h5 {
    margin: 0 0 10px 0;
    color: #333;
  }
`;

export const WordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const WordItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  background: ${(props) => (props.$isCorrect ? "#c8e6c9" : "#ffebee")};
  border-left: 4px solid ${(props) => (props.$isCorrect ? "#4caf50" : "#f44336")};
`;

export const WordText = styled.span`
  font-weight: bold;
  min-width: 100px;
`;

export const WordPosition = styled.span`
  color: #666;
  min-width: 40px;
`;

export const WordStatus = styled.span`
  min-width: 30px;
`;

export const WordSuggestion = styled.span`
  color: #666;
  font-style: italic;
  margin-left: auto;
`;

export const CardControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
  gap: 15px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CardNavigation = styled.div`
  display: flex;
  gap: 10px;
`;

export const IconControls = styled.div`
  display: flex;
  gap: 10px;
`;
