export function shareLessonUrl(lessonId) {
  return `${window.location.origin}/shared-lesson/${lessonId}`;
}

export async function shareLessonLink(lessonId, title) {
  const url = shareLessonUrl(lessonId);
  const shareTitle = title ? `Zeeguu Audio: ${title}` : "Zeeguu Audio Lesson";

  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle, url });
      return;
    } catch (e) {
      // User dismissed the system share sheet — not an error worth surfacing.
      if (e?.name === "AbortError") return;
      // Other failures (permission, unsupported content) → fall through to copy.
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      alert("Lesson link copied to clipboard.");
      return;
    } catch (e) {
      // Fall through to prompt.
    }
  }

  window.prompt("Copy this lesson link:", url);
}
