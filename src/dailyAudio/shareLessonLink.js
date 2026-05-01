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
      if (e?.name === "AbortError") return;
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      alert("Lesson link copied to clipboard.");
      return;
    } catch (e) {
      // intentionally swallowed; fall through
    }
  }

  window.prompt("Copy this lesson link:", url);
}
