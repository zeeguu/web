import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function RecordingControls({ isRecording, statusMessage, statusType }) {
  if (!isRecording && statusType !== "error") {
    return null;
  }

  return (
    <s.RecordingSection>
      {statusType === "error" && <s.StatusMessage $statusType={statusType}>{statusMessage}</s.StatusMessage>}

      {isRecording && (
        <s.RecordingVisualization>
          <s.SoundWave>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </s.SoundWave>
        </s.RecordingVisualization>
      )}
    </s.RecordingSection>
  );
}
