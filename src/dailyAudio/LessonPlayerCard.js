import CustomAudioPlayer from "../components/CustomAudioPlayer";
import { LessonTitle, LessonMetadata, CompletionCheck } from "./LessonView.sc";
import { LessonCard, HeaderRow } from "./SharedLessonView.sc";

// audioProps is forwarded to CustomAudioPlayer; metadata and headerAction
// are JSX slots rendered above and beside the title.
export default function LessonPlayerCard({
  title,
  isCompleted = false,
  metadata,
  headerAction,
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
    </LessonCard>
  );
}
