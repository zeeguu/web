import CustomAudioPlayer from "../components/CustomAudioPlayer";
import { LessonTitle, LessonMetadata, CompletionCheck } from "./LessonView.sc";
import { LessonCard, HeaderRow } from "./SharedLessonView.sc";

// audioProps is forwarded to CustomAudioPlayer; metadata, headerAction,
// and footerAction are JSX slots — header sits beside the title, footer
// renders below the player (use it for wide buttons that would squeeze
// the title if placed in the header).
export default function LessonPlayerCard({
  title,
  isCompleted = false,
  metadata,
  headerAction,
  footerAction,
  audioProps,
}) {
  return (
    <LessonCard $isCompleted={isCompleted}>
      <HeaderRow>
        <LessonTitle $compact>
          {title}
          {isCompleted && <> <CompletionCheck>✓</CompletionCheck></>}
        </LessonTitle>
        {headerAction}
      </HeaderRow>
      {metadata && <LessonMetadata>{metadata}</LessonMetadata>}
      <CustomAudioPlayer
        {...audioProps}
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          ...(audioProps?.style || {}),
        }}
      />
      {footerAction && (
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          {footerAction}
        </div>
      )}
    </LessonCard>
  );
}
