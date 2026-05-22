import { WEB_URL } from "../config";

export async function shareLessonLink(api, lessonId, title) {
  let url;
  try {
    const { share_uuid } = await api.createLessonShareLink(lessonId);
    url = `${WEB_URL}/shared-lesson/${share_uuid}`;
  } catch (e) {
    alert("Could not create share link. Please try again.");
    return;
  }

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
