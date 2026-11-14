// The message to show for a failed API call. The API sends actionable text as
// JSON `message` ("…too long… try a single chapter"), which _post passes on as
// is; a bare "HTTP 4xx", or anything that isn't a string, says nothing to a
// reader, so the caller's fallback is shown instead.
export function readableApiError(errorMessage, fallback) {
  const isBareHttpCode = typeof errorMessage === "string" && /^HTTP \d+$/.test(errorMessage.trim());
  return typeof errorMessage === "string" && errorMessage.trim() && !isBareHttpCode ? errorMessage : fallback;
}
