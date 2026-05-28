import React from "react";
import { SubtleTextButton } from "./LessonView.sc";
import { shareLessonLink } from "./shareLessonLink";

// The Share control shown under the player — shared by today's episode card and
// the past-lessons list so they stay identical. Renders nothing without a
// lesson id.
export default function ShareLessonButton({ api, lessonId, title, shareUuid }) {
  if (!lessonId) return null;
  return (
    <div style={{ textAlign: "center", marginTop: "-2px" }}>
      <SubtleTextButton onClick={() => shareLessonLink(api, lessonId, title, shareUuid)}>
        Share
      </SubtleTextButton>
    </div>
  );
}
