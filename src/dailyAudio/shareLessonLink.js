import { WEB_URL } from "../config";

function copyUrl(url) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(url).then(
      () => alert("Lesson link copied to clipboard."),
      () => window.prompt("Copy this lesson link:", url),
    );
  }
  window.prompt("Copy this lesson link:", url);
}

// navigator.share must be invoked synchronously within the tap to keep the
// user activation iOS requires — so callers that already know the url must not
// await anything before getting here.
function shareOrCopyUrl(url, shareTitle) {
  if (navigator.share) {
    return navigator.share({ title: shareTitle, url }).catch((e) => {
      if (e?.name === "AbortError") return;
      return copyUrl(url);
    });
  }
  return copyUrl(url);
}

export function shareLessonLink(api, lessonId, title, shareUuid) {
  const shareTitle = title ? `Zeeguu Audio: ${title}` : "Zeeguu Audio Lesson";

  // Preferred path: the share id is already on the lesson, so we share
  // synchronously and keep the tap's user activation (native sheet on iOS).
  if (shareUuid) {
    return shareOrCopyUrl(`${WEB_URL}/shared-lesson/${shareUuid}`, shareTitle);
  }

  // Legacy fallback for lessons created before share_uuid was guaranteed:
  // fetching the id first loses activation, so iOS may fall back to clipboard.
  return api
    .createLessonShareLink(lessonId)
    .then(({ share_uuid }) =>
      shareOrCopyUrl(`${WEB_URL}/shared-lesson/${share_uuid}`, shareTitle),
    )
    .catch(() => alert("Could not create share link. Please try again."));
}
